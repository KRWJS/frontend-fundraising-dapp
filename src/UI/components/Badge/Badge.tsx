// Styles
import styles from './Badge.module.scss';

// Types
type BadgeProps = {
  number: number;
};

const Badge = ({ number }: BadgeProps) => {
  const renderText = number === 1 ? 'request' : 'requests';

  return (
    <div className={styles.badge}>
      {number} <span>{renderText}</span>
    </div>
  );
};

export default Badge;
