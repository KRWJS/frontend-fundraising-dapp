// Packages
import { ReactNode } from 'react';

// Utils
import BN from '@/web3/utils/bn';

// Styles
import styles from './Overview.module.scss';

// Types
type OverviewProps = {
  icon: ReactNode;
  label: string;
  value: BN | string;
  addon?: string;
  decimals?: number;
};

const Overview = ({ icon, label, value, addon, decimals }: OverviewProps) => {
  return (
    <div className={styles.overview}>
      {icon}
      <p className={styles.label}>{label}</p>
      <h4 className={styles.value}>
        {new BN(value).format(decimals)}
        <span>{addon && addon}</span>
      </h4>
    </div>
  );
};

export default Overview;
