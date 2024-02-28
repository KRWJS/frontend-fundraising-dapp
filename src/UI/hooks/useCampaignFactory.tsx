// Packages
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useMetaMask } from 'metamask-react';

// ABI
import ABI from '@/web3/ABIs/CampaignFactory.json';

// Constants
import { CONTRACT_ADDRESS } from '@/web3/constants/addresses';

export const useCampaignFactory = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [factory, setFactory] = useState<any | null>(null);
  const { ethereum } = useMetaMask();

  useEffect(() => {
    if (ethereum) {
      const web3Instance = new Web3(ethereum);
      setWeb3(web3Instance);

      const contractInstance = new web3Instance.eth.Contract(
        JSON.parse(ABI.interface),
        CONTRACT_ADDRESS
      );

      setFactory(contractInstance);
    }
  }, [ethereum]);

  return { web3, factory };
};
