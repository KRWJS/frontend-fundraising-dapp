// Packages
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useMetaMask } from 'metamask-react';

// ABI
import ABI from '@/web3/ABIs/Campaign.json';

export const useCampaign = (address: string) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [campaign, setCampaign] = useState<any | null>(null);
  const { ethereum } = useMetaMask();

  useEffect(() => {
    if (ethereum) {
      const web3Instance = new Web3(ethereum);
      setWeb3(web3Instance);

      const contractInstance = new web3Instance.eth.Contract(
        JSON.parse(ABI.interface),
        address
      );

      setCampaign(contractInstance);
    }
  }, [ethereum, address]);

  return { web3, campaign };
};
