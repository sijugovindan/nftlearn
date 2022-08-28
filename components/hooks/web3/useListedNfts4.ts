import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";

import useSWR from "swr";

type UseListedNftsResponse = {}
//type ListedNftsHookFactory = CryptoHookFactory<any, UseListedNftsResponse>
type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
  const {data, ...swr} = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      //const coreNfts = await contract!.getAllNftsOnSale() as Nft[];
      const nfts = [] as Nft[];
      const coreNfts = await contract!.getAllAssetsOnSale();
      
      //const nfts = [] as any;

      for (let i = 0; i < coreNfts.length; i++) {
        const item = coreNfts[i];
        const tokenURI = await contract!.tokenURI(item.tokenId);
        const metaRes = await fetch(tokenURI);
        const meta = await metaRes.json();
        console.log("tokenid",item.tokenId.toNumber())
        console.log("creator",item.creator)
        console.log("item.isListed",item.isListed)
        console.log("meta",meta);

        nfts.push({
          //price: parseFloat(ethers.utils.formatEther(item.price)),
          tokenId: item.tokenId.toNumber(),
          creator: item.creator,
          isListed: item.isListed,
          meta
        })
      }

      //debugger
      return nfts;
    }
  )
  return {
    ...swr,
    data: data || [],
  };
}