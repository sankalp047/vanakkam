// Google accounts allowed into the admin dashboard. Keep in sync with the
// email check in firestore.rules / storage.rules.
export const ADMIN_EMAILS = ['sankalpsingh6@gmail.com'];

export function isAdminEmail(email) {
  return Boolean(email) && ADMIN_EMAILS.includes(email.toLowerCase());
}
