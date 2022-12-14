import { withIronSession } from "next-iron-session";
import contract from "../../public/contracts/NFTMarket.json";

const NETWORKS = {
  "5777": "Ganache"
}

type NETWORK = typeof NETWORKS;

const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

export const contractAddress = contract["networks"][targetNetwork]["address"];

export function withSession(handler: any) {
  console.log("nodenv", process.env.NODE_ENV);
  console.log("password:",process.env.SECRET_COOKIE_PASSWORD);
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "nft-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    }
  })
} 