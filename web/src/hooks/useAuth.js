import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

/**
 * Tracks the signed-in Firebase user and whether they're present in the
 * admins/{uid} allowlist doc (see firestore.rules — presence = admin,
 * no roles/claims needed for a 1-3 person staff team).
 */
export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = not yet resolved
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'admins', nextUser.uid));
        setIsAdmin(snap.exists());
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return { user, isAdmin, loading, login, logout };
}
