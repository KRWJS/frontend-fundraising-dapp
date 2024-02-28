// Components
import Logo from '@/UI/components/Logo/Logo';
import Wallet from '@/UI/components/Wallet/Wallet';

// Styles
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          <Wallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
