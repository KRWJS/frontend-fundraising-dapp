// Packages
import Link from 'next/link';

// Styles
import styles from './Logo.module.scss';

const Logo = () => {
  return (
    <Link href='/' title='Click to home'>
      <h4 className={styles.logo}>Fundraising dApp</h4>
    </Link>
  );
};

export default Logo;
