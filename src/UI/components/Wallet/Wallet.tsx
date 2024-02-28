// Packages
import React, { useCallback } from 'react';
import { useMetaMask } from 'metamask-react';

// Components
import Button from '@/UI/components/Button/Button';
import IconWarning from '@/UI/components/Icons/IconWarning';
import IconWallet from '@/UI/components/Icons/IconWallet';
import Loader from '@/UI/components/Loader/Loader';

// Utils
import { shortAddress } from '@/UI/utils/address';

// Hooks
import { useNetworkCheck } from '@/UI/hooks/useNetworkCheck';
import Link from 'next/link';
import IconFaucet from '../Icons/IconFaucet';

const Wallet = () => {
  const { status, connect, account } = useMetaMask();
  const { isCorrectNetwork, switchToSepolia } = useNetworkCheck();

  const handleConnectWallet = useCallback(async () => {
    if (status === 'notConnected') {
      await connect();
      await switchToSepolia();
    }
  }, [connect, switchToSepolia, status]);

  const renderWalletStatus = () => {
    switch (status) {
      case 'initializing':
        return (
          <Button title='Wallet initializing'>
            <Loader /> Initializing
          </Button>
        );
      case 'unavailable':
        return (
          <Button title='Wallet unavailable' disabled>
            Unavailable
          </Button>
        );
      case 'notConnected':
        return (
          <Button title='Click to connect wallet' onClick={handleConnectWallet}>
            <IconWallet /> Connect Wallet
          </Button>
        );
      case 'connecting':
        return (
          <Button title='Wallet connecting'>
            <Loader /> Connecting
          </Button>
        );
      case 'connected':
        if (!isCorrectNetwork) {
          return (
            <Button
              title='Click to switch to Sepolia'
              variant='warning'
              onClick={switchToSepolia}>
              <IconWarning /> Switch to Sepolia
            </Button>
          );
        }
        return (
          <>
            <Button title='Wallet connected' variant='success' disabled>
              Sepolia | {shortAddress(account)}
            </Button>
            <Link
              title='Click to get test funds'
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.alchemy.com/faucets/ethereum-sepolia'
              className='btn--secondary'>
              <IconFaucet /> Faucet
            </Link>
          </>
        );
      default:
        return (
          <Button title='Click to connect wallet' onClick={handleConnectWallet}>
            <IconWallet /> Connect Wallet
          </Button>
        );
    }
  };

  return <>{renderWalletStatus()}</>;
};

export default Wallet;
