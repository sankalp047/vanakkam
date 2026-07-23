import { useEffect, useState } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { isAdminEmail } from '../lib/admins';

const googleProvider = new GoogleAuthProvider();

/**
 * Tracks the signed-in Firebase user (Google sign-in only) and whether their
 * email is on the admin allowlist (see src/lib/admins.js + firestore.rules).
 */
export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = not yet resolved
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAdmin(nextUser ? isAdminEmail(nextUser.email) : false);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  return { user, isAdmin, loading, loginWithGoogle, logout };
}
