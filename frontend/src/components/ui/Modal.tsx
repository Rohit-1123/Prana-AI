import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { fadeIn, modalVariants, drawerVariants } from "../../animations";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <motion.div
            variants={fadeIn(0.25)}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Content layer */}
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              "bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-floating relative z-10",
              className
            )}
          >
            <div className="flex justify-between items-center mb-4">
              {title && <h3 className="type-title text-base text-[var(--text-primary)] font-bold">{title}</h3>}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export interface DrawerProps extends ModalProps {
  side?: "left" | "right";
  sizeClassName?: string;
}

export const Drawer = ({ isOpen, onClose, title, children, side = "right", sizeClassName = "max-w-sm" }: DrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            variants={fadeIn(0.25)}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
          />
          
          {/* Drawer side sheet content */}
          <motion.div
            variants={drawerVariants(side)}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              "w-full bg-[var(--surface)] border-l border-[var(--border)] h-full relative z-10 p-6 flex flex-col gap-6 shadow-floating",
              side === "left" && "border-l-0 border-r justify-start",
              sizeClassName
            )}
          >
            <div className="flex justify-between items-center shrink-0">
              {title && <h3 className="type-title text-base text-[var(--text-primary)] font-bold">{title}</h3>}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
