import { useEffect, useState } from "react";

const useBreakpoint = () => {
  const [bp, setBp] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    w: 1200,
  });

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;

      setBp({
        isMobile: w < 640,
        isTablet: w >= 640 && w < 1024,
        isDesktop: w >= 1024,
        w,
      });
    };

    calc();

    window.addEventListener("resize", calc);

    return () =>
      window.removeEventListener("resize", calc);
  }, []);

  return bp;
};

export default useBreakpoint;