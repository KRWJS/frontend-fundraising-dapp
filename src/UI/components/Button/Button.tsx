// Packages
import { MouseEvent, ReactNode } from 'react';

// Styles
import styles from './Button.module.scss';

// Types
type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  size?: 'md' | 'lg';
  title: string;
  type?: 'button' | 'submit' | 'reset';
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'warning'
    | 'success'
    | 'filter'
    | 'approve';
  disabled?: boolean;
};

const Button = ({
  children,
  className,
  onClick,
  role = 'button',
  size = 'md',
  title,
  type = 'button',
  variant = 'primary',
  disabled
}: ButtonProps) => {
  // Get button classes based on size and variant props
  const getButtonClass = () => {
    const classList = [
      styles.btn,
      styles[`btn--${size}`],
      styles[`btn--${variant}`]
    ];
    if (className) classList.push(className);
    return classList.join(' ');
  };

  return (
    <button
      role={role}
      type={type}
      className={getButtonClass()}
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
