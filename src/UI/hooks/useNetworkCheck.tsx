// Packages
import { toast } from 'react-toastify';
import { useState, useEffect, useCallback } from 'react';
import { useMetaMask } from 'metamask-react';

// Constants
import { SEPOLIA_NETWORK } from '@/web3/constants/networks';

export const useNetworkCheck = () => {
  const { ethereum, chainId } = useMetaMask();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  useEffect(() => {
    setIsCorrectNetwork(chainId === SEPOLIA_NETWORK);
  }, [chainId]);

  const switchToSepolia = useCallback(async () => {
    if (ethereum && chainId !== SEPOLIA_NETWORK) {
      try {
        setIsSwitching(true);
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_NETWORK }]
        });
        setIsCorrectNetwork(true);
        toast.success('Network switched to Sepolia.');
      } catch (error) {
        setIsCorrectNetwork(false);
        toast.error('Failed to switch to Sepolia.');
      } finally {
        setIsSwitching(false);
      }
    }
  }, [ethereum, chainId]);

  return { isCorrectNetwork, switchToSepolia, isSwitching };
};
