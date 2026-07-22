import { useContactMessages } from '../../hooks/useContactMessages';
import './admin-shared.css';

function formatDate(timestamp) {
  const millis = timestamp?.toMillis?.();
  if (!millis) return '—';
  return new Date(millis).toLocaleString();
}

export function AdminInboxPage() {
  const { messages, status } = useContactMessages();

  return (
    <div>
      <h1 className="admin-page__title">Contact Inbox</h1>

      {status === 'error' && <p className="admin-empty">Couldn't load messages.</p>}
      {status === 'ready' && messages.length === 0 && <p className="admin-empty">No messages yet.</p>}

      {messages.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Business</th>
                <th>Email Status</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{formatDate(msg.createdAt)}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.phone}</td>
                  <td>{msg.businessName}</td>
                  <td>
                    {msg.mailgun?.error ? (
                      <span className="admin-badge admin-badge--error">Failed</span>
                    ) : msg.mailgun?.results ? (
                      <span className="admin-badge admin-badge--ok">Sent</span>
                    ) : (
                      <span className="admin-badge">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
