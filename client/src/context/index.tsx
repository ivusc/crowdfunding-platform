import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { SmartContract } from '@thirdweb-dev/sdk';

interface IStateContext{
  connect: () => Promise<{
    data?: any | undefined;
      error?: Error | undefined;
  } | {
      error: Error;
  }>;
  address: string | undefined;
  createCampaign: (form: IForm) => Promise<void>;
  getCampaigns: () => Promise<ICampaign[]>;
  donate: (pId: number, amount: string) => Promise<any>;
  getDonations: (pId: number) => Promise<{
      donator: string;
      donation: string;
  }[]>;
  getUserCampaigns: () => Promise<ICampaign[]>;
  contract: SmartContract<ethers.BaseContract> | undefined;
}

const StateContext = createContext({} as IStateContext);

export const StateContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { contract } = useContract("0xCF5E60fc17bfC70e99103622eB8E72c6A7cc1E6A");

  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form: IForm) => {
    try{
      const data = await createCampaign([
        address!, //owner
        form.title, //title
        form.description, //description
        form.target,
        new Date(form.deadline).getTime(), //deadline
        form.image //image
      ])

      //console.log('contract call success', data);

    } catch (error) {
      //console.log('contract call error', error);
    }
  }
  
  const getCampaigns = async () => {
    const campaigns =  await contract?.call('getCampaigns');
    //console.log(campaigns);
    const parsedCampaigns : ICampaign[] = campaigns.map((campaign: any, i: number)=> ({
      owner: campaign.owner,
      title: campaign.title,
      image: campaign.image,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      pId: i
    }));

    return parsedCampaigns;
  }

  const donate = async (pId: number, amount: string) => {
    const data = await contract?.call('donateToCampaign', pId, {
      value: ethers.utils.parseEther(amount)
    });

    return data;
  }

  const getDonations = async (pId: number) => {
    const donations = await contract?.call('getDonators',pId);
    //donations: [[donators],[donations]]
    const numberOfDonations = donations[0].length; //get number of donators

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i ++){
      parsedDonations.push({
        donator: donations[0][i].toString(),
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  }

  const getUserCampaigns = async () => {
    const allCampaigns =  await getCampaigns();
    const filteredCampaigns = allCampaigns.filter((campaign:ICampaign) => campaign.owner === address);
    return filteredCampaigns;
  }

  return (
    <StateContext.Provider 
      value={{
        connect,
        address,
        contract,
        createCampaign : publishCampaign,
        getCampaigns,
        donate,
        getDonations,
        getUserCampaigns
      }}
    >
      { children }
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);
