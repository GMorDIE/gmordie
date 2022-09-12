import { Address } from "../../components/Address";
import { copyToClipboard } from "../../lib/copyToClipboard";
import { BodyCell, BodyRow } from "./LeaderboardShared";
import { useUserData } from "./useUserData";
import Identicon from "@polkadot/react-identicon";
import { useCallback } from "react";

export const LeaderboardUserRow = ({
  address,
  avatar,
  sortBy,
  ascending,
}: {
  address: string;
  avatar?: string;
  sortBy: "sent" | "received";
  ascending: boolean;
}) => {
  const { data } = useUserData(address, sortBy, ascending);

  const handleCopyClick = useCallback(() => {
    copyToClipboard(address as string);
  }, [address]);

  // no need to display any error
  if (!address || !data?.rankAccount?.account) return null;

  return (
    <BodyRow className="text-salmon-500 border-b-salmon-500 border-b-2">
      <BodyCell className="text-center">{data?.rankAccount.rank}</BodyCell>
      <BodyCell className="text-left cursor-pointer" onClick={handleCopyClick}>
        <div className="flex align-middle gap-2 ">
          {avatar ? (
            <img width={24} height={24} src={avatar} alt="" />
          ) : (
            <Identicon value={address} size={24} theme="polkadot" />
          )}
          <Address
            keep={6}
            address={address}
            display={data.rankAccount.account.display}
            verified={data.rankAccount.account.verified}
          />
        </div>
      </BodyCell>
      <BodyCell className="text-center">
        {data.rankAccount.account.sentGMGN}
      </BodyCell>
      <BodyCell className="text-center">
        {data.rankAccount.account.receivedGMGN}
      </BodyCell>
    </BodyRow>
  );
};
