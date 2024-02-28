// Packages
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useMetaMask } from 'metamask-react';

// ABI
import ABI from '@/web3/ABIs/Campaign.json';

// Types
interface CampaignSummary {
  address: string;
  minimumContribution: string;
  balance: string;
  requestsCount: string;
  approversCount: string;
  manager: string;
}

type CampaignSummaryTuple = [string, string, string, string, string];

export const useCampaignSummaries = (addresses: string[]) => {
  // Hooks
  const { ethereum } = useMetaMask();

  // States
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [summaries, setSummaries] = useState<CampaignSummary[]>([]);

  useEffect(() => {
    const getSummaries = async () => {
      if (ethereum) {
        const web3Instance = new Web3(ethereum);
        setWeb3(web3Instance);

        const fetchedSummaries: CampaignSummary[] = await Promise.all(
          addresses.map(async (address): Promise<CampaignSummary> => {
            const contractInstance = new web3Instance.eth.Contract(
              JSON.parse(ABI.interface),
              address
            );

            const summary: CampaignSummaryTuple = await contractInstance.methods
              .getSummary()
              .call();

            return {
              address,
              minimumContribution: summary[0],
              balance: summary[1],
              requestsCount: summary[2],
              approversCount: summary[3],
              manager: summary[4]
            };
          })
        );

        setSummaries(fetchedSummaries);
      }
    };

    getSummaries();
  }, [ethereum, addresses]);

  return { web3, summaries };
};
