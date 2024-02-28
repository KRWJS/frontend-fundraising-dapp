// Packages
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import web3 from 'web3';
import { useMetaMask } from 'metamask-react';
import { isAddress } from 'web3-validator';

// Hooks
import { useCampaign } from '@/UI/hooks/useCampaign';
import { useEtherBalance } from '@/UI/hooks/useBalance';
import { useNetworkCheck } from '@/UI/hooks/useNetworkCheck';

// Utils
import { shortAddress } from '@/UI/utils/address';
import BN from '@/web3/utils/bn';

// Components
import Badge from '@/UI/components/Badge/Badge';
import Table from '@/UI/components/Table/Table';
import Widget from '@/UI/layouts/Widget/Widget';
import Button from '@/UI/components/Button/Button';
import Input from '@/UI/components/Input/Input';
import Overview from '@/UI/components/Overview/Overview';
import IconBalance from '@/UI/components/Icons/IconBalance';
import IconMinimumDonation from '@/UI/components/Icons/IconMinimumDonation';
import IconRequests from '@/UI/components/Icons/IconRequests';
import IconContributors from '@/UI/components/Icons/IconContributors';
import IconArrowLeft from '@/UI/components/Icons/IconArrowLeft';
import Loader from '@/UI/components/Loader/Loader';
import IconWarning from '@/UI/components/Icons/IconWarning';

const Modal = dynamic(() => import('@/UI/components/Modal/Modal'), {
  ssr: false
});

// Layouts
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Flex from '@/UI/layouts/Flex/Flex';

interface CampaignSummary {
  minimumContribution: BN;
  balance: BN;
  requestsCount: BN;
  approversCount: BN;
  manager: string;
}

const Campaign = () => {
  const router = useRouter();
  const { account } = useMetaMask();
  const { balanceEther } = useEtherBalance();
  const { isCorrectNetwork, switchToSepolia, isSwitching } = useNetworkCheck();

  const campaignId =
    typeof router.query.campaign === 'string' ? router.query.campaign : '';

  const { campaign } = useCampaign(campaignId);

  const [campaignSummary, setCampaignSummary] = useState<CampaignSummary>({
    minimumContribution: new BN(0),
    balance: new BN(0),
    requestsCount: new BN(0),
    approversCount: new BN(0),
    manager: ''
  });

  // GET DEPLOYED CAMPAIGNS
  useEffect(() => {
    if (campaign) {
      const getDeployedCampaigns = async () => {
        try {
          const _campaignSummary = await campaign.methods.getSummary().call();

          setCampaignSummary({
            minimumContribution: _campaignSummary[0],
            balance: _campaignSummary[1],
            requestsCount: _campaignSummary[2],
            approversCount: _campaignSummary[3],
            manager: _campaignSummary[4]
          });
        } catch (error) {
          toast.error(`Error. ${error}`);
        }
      };

      getDeployedCampaigns();
    }
  }, [campaign]);

  // HANDLE DONATIONS
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donation, setDonation] = useState<string>('');
  const [isDonateLoading, setIsDonateLoading] = useState<boolean>(false);

  const handleDonation = async () => {
    if (account) {
      setIsDonateLoading(true);
      try {
        await campaign.methods.contribute().send({
          from: account,
          to: campaign.options.address,
          value: web3.utils.toWei(donation, 'ether')
        });
        toast.success('Donation successful.');
        setIsDonateLoading(false);
        setShowDonationModal(false);
      } catch (error) {
        toast.error('Donation failed. Please try again.');
      }
      setIsDonateLoading(false);
    }
  };

  // HANDLE CREATE REQUESTS
  const [description, seDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isCreateRequestLoading, setIsCreateRequestLoading] =
    useState<boolean>(false);

  const handleCreateRequest = async () => {
    if (account) {
      try {
        setIsCreateRequestLoading(true);
        await campaign.methods
          .createRequest(
            description,
            web3.utils.toWei(amount, 'ether'),
            recipient
          )
          .send({
            from: account
          });
        setShowRequestModal(false);
        setShowDonationModal(false);
        toast.success('Request creation successful.');
      } catch (error) {
        toast.error('Request creation failed. Please try again.');
      }
      setIsCreateRequestLoading(false);
    }
  };

  // HANDLE GET REQUESTS
  interface Request {
    approvalCount: number;
    complete: boolean;
    id: number;
    description: string;
    value: string;
  }

  const [requests, setRequests] = useState<Request[]>([]);
  const [approversCount, setApproversCount] = useState<BN>(new BN(0));

  useEffect(() => {
    if (campaign) {
      const getRequests = async () => {
        try {
          const _requests = await campaign.methods.getRequestsCount().call();
          const _approversCount = await campaign.methods
            .approversCount()
            .call();

          const loadedRequests = await Promise.all(
            Array(parseInt(_requests))
              .fill(null)
              .map((_, index) => campaign.methods.requests(index).call())
          );

          setRequests(loadedRequests);
          setApproversCount(_approversCount);
        } catch (error) {
          toast.error('Unable to get requests list. Please try again.');
        }
      };

      getRequests();
    }
  }, [campaign]);

  // HANDLE APPROVE REQUEST
  const handleApproveRequest = async (id: number) => {
    if (campaign) {
      try {
        await campaign.methods.approveRequest(id).send({
          from: account
        });
        toast.success('Request approved.');
      } catch (error) {
        toast.error('Unable to approve request. Please try again.');
      }
    }
  };

  // HANDLE FINALIZE REQUEST
  const handleFinalizeRequest = async (id: number) => {
    try {
      await campaign.methods.finalizeRequest(id).send({
        from: account
      });
      toast.success('Request finalized.');
    } catch (error) {
      toast.error('Unable to finalize request. Please try again.');
    }
  };

  const renderRequestButton = () => {
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

    if (!amount.trim()) {
      return (
        <Button
          title='Enter an amount'
          disabled
          className='full-width'
          variant='secondary'
          size='lg'>
          Enter an amount
        </Button>
      );
    }

    if (new BN(amount).gt(new BN(campaignSummary.balance))) {
      return (
        <Button
          title='Insufficient fundraiser balance'
          disabled
          className='full-width'
          variant='secondary'
          size='lg'>
          Insufficient fundraiser balance
        </Button>
      );
    }

    if (!description.trim()) {
      return (
        <Button
          title='Description is required'
          disabled
          className='full-width'
          variant='secondary'
          size='lg'>
          Description is required
        </Button>
      );
    }

    if (!recipient.trim() || !isAddress(recipient)) {
      return (
        <Button
          title='Invalid recipient address'
          disabled
          className='full-width'
          variant='secondary'
          size='lg'>
          Invalid recipient address
        </Button>
      );
    }

    if (isCreateRequestLoading) {
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
        onClick={handleCreateRequest}
        className='full-width'
        size='lg'>
        Confirm
      </Button>
    );
  };

  const renderDonationButton = () => {
    const donationInWei = web3.utils.toWei(donation || '0', 'ether');

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

    if (
      new BN(donationInWei).lt(campaignSummary.minimumContribution) ||
      new BN(donation).lte(0)
    ) {
      return (
        <Button
          title='Donation amount is less than the minimum contribution'
          disabled
          className='full-width'
          variant='secondary'
          size='lg'>
          <IconWarning /> Min. Donation of{' '}
          {new BN(campaignSummary.minimumContribution).format(0)} WEI
        </Button>
      );
    }

    if (new BN(donation).gt(balanceEther)) {
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

    if (isDonateLoading) {
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
        onClick={handleDonation}
        className='full-width'
        size='lg'>
        Confirm
      </Button>
    );
  };

  return (
    <>
      <Head>
        <title>Testnet: Fundraising dApp</title>
      </Head>

      <Main>
        <Container size='xl'>
          <Link href='/' title='Click to view all fundraisers'>
            <IconArrowLeft /> Back to fundraisers
          </Link>
          {/** FUNDRAISER HEADER */}
          <Flex
            direction='row-center-space-between'
            margin='pb-18 border-bottom mb-24 mt-24'>
            <div>
              <h2 className='mb-8'>Fundraiser: {shortAddress(campaignId)}</h2>
              <p>
                View fundraiser details, donate, create and approve requests.
                This fundraiser is managed by{' '}
                <Link
                  title='Click to view managers transactions'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`https://sepolia.etherscan.io/address/${campaignSummary.manager}`}>
                  {shortAddress(campaignSummary.manager)}
                </Link>
                .
              </p>
            </div>
            <Button
              onClick={() => setShowDonationModal(true)}
              title='Click to make a dontation'
              size='lg'>
              Make a donation
            </Button>
          </Flex>

          {/** FUNDRAISER DETAILS */}
          <Flex direction='row' gap='gap-24' margin='mb-24'>
            <Overview
              label='Balance'
              value={new BN(campaignSummary.balance).weiToEther(18).format()}
              addon='ETH'
              icon={<IconBalance />}
            />
            <Overview
              label='Minimum Donation'
              value={campaignSummary.minimumContribution}
              addon='WEI'
              icon={<IconMinimumDonation />}
              decimals={0}
            />
            <Overview
              label='Requests'
              value={campaignSummary.requestsCount}
              decimals={0}
              icon={<IconRequests />}
            />
            <Overview
              label='Contributors'
              value={campaignSummary.approversCount}
              decimals={0}
              icon={<IconContributors />}
            />
          </Flex>

          {/** RECENT REQUESTS */}
          <Widget>
            <Flex
              direction='row-center-space-between'
              margin='p-24 border-bottom'>
              <h4>
                Recent requests <Badge number={requests.length} />
              </h4>
              <Button
                onClick={() => setShowRequestModal(true)}
                title='Click to create a request'
                variant='secondary'>
                Create a request
              </Button>
            </Flex>
            <Table
              requests={requests}
              approversCount={approversCount}
              onApprove={handleApproveRequest}
              onFinalize={handleFinalizeRequest}
            />
          </Widget>
        </Container>
      </Main>

      {/** REQUEST MODAL */}
      <Modal
        isOpen={showRequestModal}
        onCloseModal={() => setShowRequestModal(false)}
        title='Create a request'
        subtitle='Please complete the form to make a spending request.'>
        <Input
          id='amount'
          label='Amount'
          type='number'
          value={amount}
          onChange={(e) => setAmount(e.currentTarget.value)}
          placeholder='100'
          inputAddon='WEI'
          className='mb-24'
        />

        <Input
          id='description'
          label='Description'
          type='text'
          value={description}
          onChange={(e) => seDescription(e.target.value)}
          placeholder='Office supplies'
          className='mb-24'
        />

        <Input
          id='recipient'
          label='Recipient address'
          type='text'
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder='0x991...1AF'
          className='mb-24'
        />

        {renderRequestButton()}
      </Modal>

      {/** DONATE MODAL */}
      <Modal
        isOpen={showDonationModal}
        onCloseModal={() => setShowDonationModal(false)}
        title='Make a donation'
        subtitle='Please enter your donation amount.'>
        <Input
          id='donation'
          label='Balance:'
          type='number'
          value={donation.toString()}
          onChange={(e) => setDonation(e.target.value)}
          placeholder={campaignSummary.minimumContribution.toString()}
          inputAddon='ETH'
          labelAddon={`${balanceEther} ETH`}
          className='mb-24'
        />

        {renderDonationButton()}
      </Modal>
    </>
  );
};

export default Campaign;
