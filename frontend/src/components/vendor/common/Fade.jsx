import { useEffect, useRef, useState } from 'react';

const Fade = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);

  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,

        transform: inView ? 'translateY(0)' : 'translateY(16px)',

        transition: `
          opacity 0.5s ease ${delay}s,
          transform 0.5s ease ${delay}s
        `,

        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Fade;
