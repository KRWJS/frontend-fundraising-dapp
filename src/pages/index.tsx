// Packages
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useMetaMask } from 'metamask-react';

// Hooks
import { useCampaignFactory } from '@/UI/hooks/useCampaignFactory';
import { useCampaignSummaries } from '@/UI/hooks/useCampaignSummaries';
import { useEtherBalance } from '@/UI/hooks/useBalance';
import { useNetworkCheck } from '@/UI/hooks/useNetworkCheck';

// Utils
import BN from '@/web3/utils/bn';

// Components
import Card from '@/UI/components/Card/Card';
import Loader from '@/UI/components/Loader/Loader';
import Button from '@/UI/components/Button/Button';
import Input from '@/UI/components/Input/Input';
import IconWarning from '@/UI/components/Icons/IconWarning';
import IconPlus from '@/UI/components/Icons/IconPlus';

const Modal = dynamic(() => import('@/UI/components/Modal/Modal'), {
  ssr: false
});

// Layouts
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Flex from '@/UI/layouts/Flex/Flex';

const Index = () => {
  const { factory } = useCampaignFactory();
  const { isCorrectNetwork, switchToSepolia, isSwitching } = useNetworkCheck();
  const { balanceEther, balanceWei } = useEtherBalance();

  // DEPLOYED CAMPAIGNS
  const [deployedCampaigns, setDeployedCampaigns] = useState<string[]>([]);
  const [isContractsLoading, setIsContractsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getDeployedCampaigns = async () => {
      if (factory) {
        setIsContractsLoading(true);
        try {
          const campaigns = await factory.methods.getDeployedCampaigns().call();
          setDeployedCampaigns(campaigns);
        } catch (error) {
          console.error('Failed to fetch deployed campaigns:', error);
        }
        setIsContractsLoading(false);
      }
    };

    getDeployedCampaigns();
  }, [factory]);

  // Get campaign summaries
  const { summaries } = useCampaignSummaries(deployedCampaigns);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [minimumAmount, setMinimumAmount] = useState<string>('');

  // Render button
  const renderButton = () => {
    if (isSwitching) {
      return (
        <Button
          title='Switching network'
          disabled
          className='full-width'
          variant='warning'
          size='lg'>
          <Loader /> Switching in progress
        </Button>
      );
    }
    if (!isCorrectNetwork) {
      return (
        <Button
          title='Click to switch to Sepolia'
          onClick={switchToSepolia}
          className='full-width'
          size='lg'
          variant='warning'>
          <IconWarning /> Switch to Sepolia
        </Button>
      );
    }

    if (Number(minimumAmount) > Number(balanceWei)) {
      return (
        <Button
          title='Insufficient balance'
          disabled
          className='full-width'
          variant='secondary'
          size='lg'>
          <IconWarning /> Insufficient Balance
        </Button>
      );
    }

    if (Number(minimumAmount) <= 0) {
      return (
        <Button
          title='Enter ETH Amount'
          disabled
          className='full-width'
          variant='secondary'
          size='lg'>
          <IconWarning /> Enter amount
        </Button>
      );
    }

    if (isCreateLoading) {
      return (
        <Button
          title='Transaction Processing'
          disabled
          className='full-width'
          size='lg'>
          <Loader /> Transaction in progress
        </Button>
      );
    }

    return (
      <Button
        title='Click to confirm'
        onClick={handleCreateFundraiser}
        className='full-width'
        size='lg'>
        Confirm
      </Button>
    );
  };

  // Create campaign
  const { account } = useMetaMask();
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

  const handleCreateFundraiser = async () => {
    if (account) {
      setIsCreateLoading(true);
      try {
        await factory.methods.createCampaign(minimumAmount).send({
          from: account
        });
        toast.success('Fundraiser creation successful.');
        setIsCreateLoading(false);
        setShowCreateModal(false);
      } catch (error) {
        toast.error('Fundraiser creation failed. Please try again.');
      }
      setIsCreateLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Testnet: Fundraising dApp</title>
      </Head>

      <Main>
        <Container size='xl'>
          <Flex
            direction='row-center-space-between'
            margin='pb-18 border-bottom mb-24'>
            <div>
              <h2 className='mb-8'>Fundraisers</h2>
              <p>
                Create a transparent and secure fundraising campaign in two
                clicks.
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              title='Click to create a fundraiser'
              size='lg'>
              <IconPlus /> Create a fundraiser
            </Button>
          </Flex>

          <Flex direction='row-wrap' gap='gap-24'>
            {isContractsLoading ? (
              <Loader type='lg' />
            ) : (
              summaries.map((summary, index) => (
                <Card
                  key={index}
                  title={summary.address}
                  value={new BN(summary.balance).weiToEther(18).format()}
                />
              ))
            )}
          </Flex>
        </Container>
      </Main>

      <Modal
        isOpen={showCreateModal}
        onCloseModal={() => setShowCreateModal(false)}
        title='Create a fundraiser'
        subtitle='Please enter a minimum donation amount.'>
        <Input
          id='amount'
          label='Balance:'
          type='number'
          value={minimumAmount}
          onChange={(e) => setMinimumAmount(e.currentTarget.value)}
          placeholder='100'
          inputAddon='WEI'
          labelAddon={`${balanceEther} ETH`}
          className='mb-24'
        />

        {renderButton()}
      </Modal>
    </>
  );
};

export default Index;
