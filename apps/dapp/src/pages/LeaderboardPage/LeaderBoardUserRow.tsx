import { Address } from "../../components/Address";
import { useWallet } from "../../lib/WalletContext";
import { copyToClipboard } from "../../lib/copyToClipboard";
import { BodyCell } from "./LeaderboardTableItems";
import { useUserStats } from "./useUserData";
import Identicon from "@polkadot/react-identicon";
import { useCallback } from "react";

export const LeaderboardUserRow = ({
  address,
  avatar,
}: {
  address: string;
  avatar?: string;
}) => {
  const { data } = useUserStats(address);

  const handleCopyClick = useCallback(() => {
    copyToClipboard(address as string);
  }, [address]);

  // no need to display any error
  if (!address || !data?.accountById) return null;

  return (
    <tr className="bg-zinc-700 odd:bg-zinc-800 hover:bg-zinc-600 font-bold text-salmon-500 border-b-salmon-500 border-b-2">
      <BodyCell className="text-center">You</BodyCell>
      <BodyCell className="text-left cursor-pointer" onClick={handleCopyClick}>
        <div className="flex align-middle gap-2 ">
          {avatar ? (
            <img width={24} height={24} src={avatar} alt="" />
          ) : (
            <Identicon value={address} size={24} theme="polkadot" />
          )}
          <Address keep={6} address={address} />
        </div>
      </BodyCell>
      <BodyCell className="text-center">{data.accountById.sentGMGN}</BodyCell>
      <BodyCell className="text-center">
        {data.accountById.receivedGMGN}
      </BodyCell>
      <BodyCell className="text-center">
        {data.accountById.balanceGMGN}
      </BodyCell>
    </tr>
  );
};
