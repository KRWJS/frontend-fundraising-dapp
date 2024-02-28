// Packages
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useMetaMask } from 'metamask-react';

// Utils
import BN from '@/web3/utils/bn';

export const useEtherBalance = () => {
  const { account, ethereum } = useMetaMask();
  const [balanceEther, setBalanceEther] = useState('0');
  const [balanceWei, setBalanceWei] = useState(new BN(0));
  const [web3, setWeb3] = useState<Web3 | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (ethereum && account) {
        const web3Instance = new Web3(ethereum);
        setWeb3(web3Instance);

        try {
          const balanceWei = await web3Instance.eth.getBalance(account);
          setBalanceWei(new BN(balanceWei));

          const balanceEther = web3Instance.utils.fromWei(balanceWei, 'ether');
          const formattedBalanceEther = parseFloat(balanceEther).toFixed(4);
          setBalanceEther(formattedBalanceEther);
        } catch (error) {
          console.error('Error fetching user balance:', error);
          setBalanceWei(new BN(0));
          setBalanceEther('0');
        }
      }
    };

    fetchBalance();
  }, [ethereum, account]);

  return { balanceEther, balanceWei, web3 };
};
