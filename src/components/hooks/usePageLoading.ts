import { useEffect, useState } from "react";

export default function usePageLoading(delay = 1200) {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

      const fadeTimer = setTimeout(() => {
        setShowLoader(false);
      }, 300);

      return () => clearTimeout(fadeTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return { loading, showLoader };
}