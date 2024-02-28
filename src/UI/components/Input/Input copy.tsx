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
};

const Input = ({
  id,
  type,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  labelAddon
}: InputProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <label htmlFor={id}>{label}</label>
        {labelAddon && labelAddon}
      </div>
      <div className={styles.input}>
        WEI
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
