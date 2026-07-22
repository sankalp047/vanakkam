/* eslint-env node */
/* eslint-disable max-len */

const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");
const {URLSearchParams} = require("url");

admin.initializeApp();

const MAILGUN_API_KEY = defineSecret("MAILGUN_API_KEY");
const MAILGUN_DOMAIN = "vanakkamfm.net";
const TEAM_TO = "sales-website@vanakkamfm.net";

exports.contactMessageCreated = onDocumentCreated(
    {
      document: "contactMessages/{docId}",
      secrets: [MAILGUN_API_KEY],
    },
    async (event) => {
      console.log("🔥 contactMessageCreated TRIGGERED for", event.params.docId);

      const snap = event.data;
      const data = snap ? snap.data() : {};

      const apiKey = MAILGUN_API_KEY.value();
      if (!apiKey || !MAILGUN_DOMAIN) {
        console.error("❌ Mailgun config missing (secret or domain).");
        return;
      }

      // Use api.eu.mailgun.net if your Mailgun domain is EU-region
      const baseUrl = "https://api.mailgun.net/v3";
      const authHeader = `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`;
      const url = `${baseUrl}/${MAILGUN_DOMAIN}/messages`;

      const name = data.name || "";
      const email = data.email || "";
      const phone = data.phone || "";
      const business = data.business || "";
      const docId = event.params.docId;

      const promises = [];

      // 1) Email to team (mailing list / group / alias)
      const teamText =
            "New Vanakkam FM lead:\n\n" +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n` +
            `Business: ${business}\n\n` +
            `Document ID: ${docId}`;

      const teamBody = new URLSearchParams({
        from: `Vanakkam FM – Website Lead <no-reply@${MAILGUN_DOMAIN}>`,
        to: TEAM_TO,
        subject: `New Vanakkam FM Lead from ${name || "Unknown"}`,
        text: teamText,
      });

      console.log("📨 Sending team email via Mailgun...");

      promises.push(
          fetch(url, {
            method: "POST",
            headers: {
              "Authorization": authHeader,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: teamBody,
          }).then(async (res) => {
            const text = await res.text();
            if (!res.ok) {
              console.error("❌ Mailgun team email error:", res.status, text);
              return {ok: false, status: res.status, text};
            }
            console.log("✅ Team notification sent:", text);
            return {ok: true, text};
          }),
      );

      // 2) Confirmation email to user
      if (email) {
        const userText =
                `Hi ${name || "there"},\n\n` +
                "Thank you for contacting Vanakkam FM!\n" +
                "Our team has received your details and will reach out to you soon.\n\n" +
                "Cheers,\n" +
                "Vanakkam FM Team";

        const userBody = new URLSearchParams({
          from: `Vanakkam FM <no-reply@${MAILGUN_DOMAIN}>`,
          to: email,
          subject: "Thanks for contacting Vanakkam FM",
          text: userText,
        });

        console.log("📨 Sending confirmation email to user...");

        promises.push(
            fetch(url, {
              method: "POST",
              headers: {
                "Authorization": authHeader,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: userBody,
            }).then(async (res) => {
              const text = await res.text();
              if (!res.ok) {
                console.error("❌ Mailgun user email error:", res.status, text);
                return {ok: false, status: res.status, text};
              }
              console.log("✅ Confirmation email sent:", text);
              return {ok: true, text};
            }),
        );
      }

      try {
        const results = await Promise.all(promises);

        await admin.firestore()
            .collection("contactMessages")
            .doc(docId)
            .set(
                {
                  mailgun: {
                    processedAt: admin.firestore.FieldValue.serverTimestamp(),
                    results,
                  },
                },
                {merge: true},
            );
      } catch (err) {
        console.error("❌ Error sending Mailgun emails:", err);

        await admin.firestore()
            .collection("contactMessages")
            .doc(docId)
            .set(
                {
                  mailgun: {
                    error: String(err),
                    failedAt: admin.firestore.FieldValue.serverTimestamp(),
                  },
                },
                {merge: true},
            );
      }
    },
);
