
import { useEffect, useState } from "react";

export const useIntersectionObserver = (options = {}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref) {
      const observer = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, options);

      observer.observe(ref);

      return () => {
        observer.disconnect();
      };
    }
  }, [ref, options]);

  return [setRef, isVisible] as const;
};

export const getAnimationProps = (isVisible: boolean, delay = 0) => {
  return {
    className: isVisible ? 'animate-fade-up' : 'opacity-0',
    style: { 
      animationDelay: `${delay}ms`,
      animationFillMode: 'forwards'
    }
  };
};

export const getStaggeredDelay = (index: number, baseDelay = 100) => {
  return index * baseDelay;
};
