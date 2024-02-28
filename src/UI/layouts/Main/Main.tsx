// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Main.module.scss';

// Types
type MainProps = {
  children: ReactNode;
};

const Main = (props: MainProps) => {
  const { children } = props;

  return (
    <>
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Main;
