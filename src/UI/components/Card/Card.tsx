// Packages
import Link from 'next/link';

// Utils
import BN from '@/web3/utils/bn';
import { shortAddress } from '@/UI/utils/address';

// Components
import IconEth from '@/UI/components/Icons/IconEth';
import IconArrowRight from '@/UI/components/Icons/IconArrowRight';

// Styles
import styles from './Card.module.scss';
import IconExternalLink from '../Icons/IconExternalLink';

// Types
type CardProps = {
  title: string;
  value: BN | string;
};

const Card = ({ title, value }: CardProps) => {
  return (
    <div className={styles.card}>
      <p className={styles.title}>
        Address:{' '}
        <Link
          title='Click to view fundraiser transactions'
          target='_blank'
          rel='noopener noreferrer'
          href={`https://sepolia.etherscan.io/address/${title}`}>
          {shortAddress(title)}
        </Link>
        <IconExternalLink />
      </p>
      <p className={styles.subtitle}>Funds raised</p>
      <h2 className={styles.value}>
        {new BN(value).format()}
        <IconEth />
        <span>ETH</span>
      </h2>
      <Link
        className={styles.link}
        title='Click to view fundraiser details'
        href={`/campaigns/${title}`}>
        View fundraiser details <IconArrowRight />
      </Link>
    </div>
  );
};

export default Card;
