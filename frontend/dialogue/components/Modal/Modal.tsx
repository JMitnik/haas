import { motion, Variants } from 'framer-motion';
interface ModalBackdropProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Backdrop = ({ children, onClick }: ModalBackdropProps) => (
  <motion.div
    onClick={onClick}
    className="backdrop"
    style={{ position: 'absolute', zIndex: 1000, top: '0', bottom: '0', right: '0', left: '0', background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {children}
  </motion.div>
);

const ModalBoxVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.08,
      type: 'spring',
      damping: 50,
      stiffness: 600,
      delayChildren: 0.3,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
  },
}

interface ModalBoxProps {
  children: React.ReactNode;
}

const ModalContentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const ModalBox = ({ children }: ModalBoxProps) => (
  <motion.div
    onClick={(e) => e.stopPropagation()}
    className="modal-box"
    variants={ModalBoxVariants}
    style={{ minWidth: 'clamp(50%, 600px, 90%)', backgroundColor: 'white', borderRadius: 5, minHeight: 100 }}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <motion.div variants={ModalContentVariants}>
      {children}
    </motion.div>
  </motion.div>
);

interface ModalProps {
  onClose?: () => void;
  children: React.ReactNode;
}

export const Modal = ({ onClose, children }: ModalProps) => (
  <Backdrop onClick={onClose}>
    <ModalBox>
      <div>
        {children}
      </div>
    </ModalBox>
  </Backdrop>
);
