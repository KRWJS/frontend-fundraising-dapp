// Packages
import { useState } from 'react';

// Utils
import BN from '@/web3/utils/bn';

// Constants
import { TABLE_HEADERS } from '@/UI/constants/table';
import { FILTER_OPTIONS } from '@/UI/constants/filter';

// Components
import Button from '@/UI/components/Button/Button';
import IconEth from '@/UI/components/Icons/IconEth';

// Styles
import styles from './Table.module.scss';
import IconApprove from '../Icons/IconApprove';
import IconFinalize from '../Icons/IconFinalize';

// Types
interface Request {
  description: string;
  approvalCount: BN | number;
  complete: boolean;
  value: string;
}

interface TableProps {
  requests: Request[];
  approversCount: BN;
  onApprove: (index: number) => void;
  onFinalize: (index: number) => void;
}

const Table = ({
  requests,
  approversCount,
  onApprove,
  onFinalize
}: TableProps) => {
  // Filter requests by status
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved'>('All');

  const filteredRequests = requests.filter((request) => {
    if (filter === 'All') return true;
    return filter === 'Approved' ? request.complete : !request.complete;
  });

  return (
    <>
      <div className={styles.filter}>
        {FILTER_OPTIONS.map((option) => (
          <Button
            variant='filter'
            title='Click to select filter'
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={filter === option.value ? styles.isActive : ''}>
            {option.label}
          </Button>
        ))}
      </div>

      <div className={styles.table}>
        <div className={styles.header}>
          {TABLE_HEADERS.map((header) => (
            <div key={header} className={styles.headerCell}>
              {header}
            </div>
          ))}
        </div>

        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, index) => (
            <div className={styles.row} key={index}>
              <div className={styles.cell}>{request.description}</div>
              <div className={styles.cell}>
                {new BN(request.approvalCount).format(0)} /{' '}
                {new BN(approversCount).format(0)}
              </div>
              <div className={styles.cell}>
                {request.complete ? (
                  <span className={styles.approved}>Finalized</span>
                ) : (
                  <span className={styles.pending}>Pending</span>
                )}
              </div>
              <div className={styles.cell}>
                {new BN(request.value).weiToEther(18).format()} <IconEth /> ETH
              </div>
              <div className={styles.cell}>
                <Button
                  title='Click to approve request'
                  onClick={() => onApprove(index)}
                  variant='approve'>
                  <IconApprove /> Approve
                </Button>
                <Button
                  title='Click to finalize request'
                  onClick={() => onFinalize(index)}
                  variant='warning'>
                  <IconFinalize /> Finalize
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noRequests}>No results.</div>
        )}
      </div>
    </>
  );
};

export default Table;
