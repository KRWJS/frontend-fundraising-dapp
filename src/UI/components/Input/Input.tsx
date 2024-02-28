// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Input.module.scss';

// Types
type InputProps = {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  labelAddon?: ReactNode;
  inputAddon?: ReactNode;
  className?: string;
};

const Input = ({
  id,
  type,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  labelAddon,
  inputAddon,
  className
}: InputProps) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <label className={styles.label} htmlFor={id}>
        {label} {labelAddon && labelAddon}
      </label>
      <div className={styles.input}>
        {inputAddon && <span className={styles.inputAddon}>{inputAddon}</span>}
        <input
          id={id}
          type={type}
          name={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
};

export default Input;
