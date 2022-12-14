import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import useSWR from "swr";

type UseListedNftsResponse = {
  buyNft: (token: number, value: number) => Promise<void>
}
type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
  const {data, ...swr} = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      const nfts = [] as Nft[];
      const coreNfts = await contract!.getAllAssetsOnSale();

      for (let i = 0; i < coreNfts.length; i++) {
        const item = coreNfts[i];
        const tokenURI = await contract!.tokenURI(item.tokenId);
        const metaRes = await fetch(tokenURI);
        const meta = await metaRes.json();
        console.log("price",parseFloat(ethers.utils.formatEther(item.price)));
        console.log("tokenId",item.tokenId.toNumber());
        console.log("creator",item.creator);
        console.log("isListed",item.isListed);
        console.log("meta",meta);

        nfts.push({
          price: parseFloat(ethers.utils.formatEther(item.price)),
          tokenId: item.tokenId.toNumber(),
          creator: item.creator,
          isListed: item.isListed,
          meta
        })
      }
      
      return nfts;
    }
  )

  const buyNft = async (tokenId: number, value: number) => {
    try {
      console.log("bynft val", value);
      console.log("bynft valstr", value.toString());
      console.log("bynft parse valstr",  ethers.utils.parseEther(value.toString()));


      const result = await contract?.buyNft(
        tokenId, {
          value: ethers.utils.parseEther(value.toString())
        }
      )

      await result?.wait();
      alert("You have bought Nft. See profile page.")
    } catch (e: any) {
      console.error(e.message);
    }
  }


  return {
    ...swr,
    buyNft,
    data: data || [],
  };
}