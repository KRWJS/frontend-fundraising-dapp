// Packages
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

// Components
import Button from '@/UI/components/Button/Button';
import Close from '@/UI/components/Icons/IconClose';

// Styles
import styles from './Modal.module.scss';

// Animation
const animatedModal = {
  hidden: {
    y: '-100vh',
    opacity: 0
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.3,
      type: 'spring',
      damping: 25,
      stiffness: 250
    }
  },
  exit: {
    y: '100vh',
    opacity: 0
  }
};

// Types
type ModalProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onCloseModal: () => void;
  isOpen: boolean;
  buttonDisabled?: boolean;
};

const Modal = ({
  children,
  title,
  subtitle,
  onCloseModal,
  isOpen
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('is-active');
    } else {
      document.body.classList.remove('is-active');
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseModal();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.body.classList.remove('is-active');
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onCloseModal]);

  const modalContent = (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onCloseModal()}>
      <motion.div
        onClick={(e: any) => e.stopPropagation()}
        className={styles.modal}
        variants={animatedModal}
        initial='hidden'
        animate='visible'
        exit='exit'>
        <div className={styles.header}>
          <Button
            onClick={onCloseModal}
            className={styles.close}
            title='Click to close modal'>
            <Close />
          </Button>
        </div>
        <div className={styles.intro}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.content}>{children}</div>
      </motion.div>
    </motion.div>
  );

  return ReactDOM.createPortal(
    <AnimatePresence initial={true} mode='wait'>
      {isOpen && modalContent}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
