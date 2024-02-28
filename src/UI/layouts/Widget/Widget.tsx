// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Widget.module.scss';

// Types
type WidgetProps = {
  children: ReactNode;
};

const Widget = ({ children }: WidgetProps) => {
  return <div className={styles.widget}>{children}</div>;
};

export default Widget;
