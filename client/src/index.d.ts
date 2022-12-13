interface IForm {
  name: string;
  title: string;
  description: string;
  target: string | ethers.BigNumber;
  deadline: string;
  image: string;
}

interface ICampaign{
  owner: string;
  image: string;
  title: string;
  description: string;
  amountCollected: string;
  deadline: number;
  target: string;
  pid: number;
}

interface IDonators {
  donator: string;
  donation: string;
}