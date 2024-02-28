// Styles
import styles from './Loader.module.scss';

// Types
type LoaderProps = {
  type?: 'sm' | 'md' | 'lg' | 'balance';
};

const Loader = ({ type = 'sm' }: LoaderProps) => {
  const loaderClass = type ? `${styles.loader} ${styles[type]}` : styles.loader;

  return (
    <div className={loaderClass}>
      <div className={styles.spinner} />
    </div>
  );
};

export default Loader;
