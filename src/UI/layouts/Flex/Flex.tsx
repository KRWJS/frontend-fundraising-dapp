// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Flex.module.scss';

// Types
type FlexProps = {
  direction?: string;
  margin?: string;
  gap?: string;
  padding?: string;
  children: ReactNode;
};

const Flex = ({
  direction = 'row',
  margin = 'm-0',
  gap = 'gap-0',
  padding = 'p-0',
  children
}: FlexProps) => {
  return (
    <div
      className={`${styles.flex} ${
        styles[`flex--${direction}`]
      } ${margin} ${gap} ${padding}`}>
      {children}
    </div>
  );
};

export default Flex;
