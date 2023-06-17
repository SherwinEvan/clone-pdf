import { useEffect } from 'react';
import DeleteSessionCookie from './deleteSessionCookie';

export function saveRememberMePreference(rememberMe) {
  localStorage.setItem("rememberMe", rememberMe ? "true" : "false");
}

export function getRememberMePreference() {
  const rememberMe = localStorage.getItem("rememberMe");
  return rememberMe === "true";
}

export function deleteRememberMePreference() {
  localStorage.removeItem("rememberMe");
}

const useRememberMe = () => {
  useEffect(() => {
    const handleUnload = () => {
      const rememberMe = localStorage.getItem("rememberMe");

      if (rememberMe === "false") {
        DeleteSessionCookie();
      }
    };

    const addUnloadEventListener = () => {
      window.addEventListener("beforeunload", handleUnload);
    };

    const removeUnloadEventListener = () => {
      window.removeEventListener("beforeunload", handleUnload);
    };

    addUnloadEventListener();

    return () => {
      removeUnloadEventListener();
    };
  }, []);
};

export default useRememberMe;
