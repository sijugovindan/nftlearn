import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

// deps -> provider, ethereum, contract (web3State)
type AccountHookFactory = CryptoHookFactory<string>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = ({provider}) => () => {
  const swrRes = useSWR(
    provider ? "web3/useAccount" : null,
    async () => {
      const accounts = await provider!.listAccounts();
      const account = accounts[0];

      if (!account) {
        throw "Cannot retreive account! Please, connect to web3 wallet."
      }

      return account;
    }, {
      revalidateOnFocus: false
    }
  )
  return swrRes;
}