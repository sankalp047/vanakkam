import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

/** Admin-only read of the contactMessages inbox, newest first. */
export function useContactMessages() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setStatus('ready');
      },
      () => setStatus('error'),
    );
    return unsubscribe;
  }, []);

  return { messages, status };
}
