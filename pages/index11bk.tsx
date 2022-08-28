import type { NextPage } from 'next'
//import BaseLayout from "../components/layout/baselayout";
import { BaseLayout, NFTList } from '@ui'
import nfts from "../contents/meta.json";
import { NFTMeta } from '@_types/nft';
import { useWeb3 } from '@providers/web3';


const Home: NextPage = () => {
  //const { test } = useWeb3();
  //const { ethereum } = useWeb3();
  //console.log(ethereum);
  //const { provider } = useWeb3();
  const { provider, contract } = useWeb3();
  console.log(contract);

  // start: connects to  blockchain and gets info
  // so need  blokchain networks settings to be done in ganache
  const getNftInfo = async () => {
    console.log(await contract!.name());
    console.log(await contract!.symbol());
  }

  if (contract) {
    // getNftInfo();
  }
  // end:



  const getAccounts = async () => {
    const accounts = await provider!.listAccounts();
    console.log(accounts[0]);
  }

  if (provider) {
    getAccounts();
  }
  
  return (
    <BaseLayout>
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Amazing Creatures NFTs</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Mint a NFT to get unlimited ownership forever!
            </p>
          </div>
          <NFTList
           nfts={nfts as NFTMeta[]}
          />
        </div>
      </div>
    </BaseLayout>
  )
}
export  default Home;