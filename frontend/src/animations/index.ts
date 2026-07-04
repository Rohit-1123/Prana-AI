import type { Variants } from "framer-motion";

export const fadeIn = (duration = 0.2): Variants => ({
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration, ease: "easeIn" as const } }
});

export const slideIn = (direction: "left" | "right" | "top" | "bottom" = "bottom", distance = 24, duration = 0.3): Variants => {
  const x = direction === "left" ? -distance : direction === "right" ? distance : 0;
  const y = direction === "top" ? -distance : direction === "bottom" ? distance : 0;
  return {
    initial: { opacity: 0, x, y },
    animate: { opacity: 1, x: 0, y: 0, transition: { duration, ease: "easeOut" as const } },
    exit: { opacity: 0, x, y, transition: { duration, ease: "easeIn" as const } }
  };
};

export const scaleIn = (initialScale = 0.95, duration = 0.2): Variants => ({
  initial: { opacity: 0, scale: initialScale },
  animate: { opacity: 1, scale: 1, transition: { duration, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: initialScale, transition: { duration, ease: "easeIn" as const } }
});

export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const cardHover: Variants = {
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.2, ease: "easeInOut" as const }
  }
};

export const buttonHover: Variants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.1, ease: "easeOut" as const }
  },
  tap: {
    scale: 0.98
  }
};

export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.2, ease: "easeIn" as const } }
};

export const drawerVariants = (side: "left" | "right" = "right"): Variants => ({
  initial: { x: side === "right" ? "100%" : "-100%" },
  animate: { x: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
  exit: { x: side === "right" ? "100%" : "-100%", transition: { ease: "easeInOut" as const, duration: 0.2 } }
});
