import { Address } from "../../components/Address";
import { Spinner } from "../../components/Spinner";
import { TokenIcon } from "../../components/TokenIcon";
import { useSendPane } from "../../features/send/context";
import { useWallet } from "../../lib/WalletContext";
import { copyToClipboard } from "../../lib/copyToClipboard";
import {
  HistoryAccount,
  HistoryTx,
  useTransactions,
} from "./useTransactionsList";
import { ArrowRightIcon } from "@heroicons/react/solid";
import Identicon from "@polkadot/react-identicon";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { FC, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useIntersection } from "react-use";

const TransactionAccount = ({
  account,
  className,
}: {
  account: HistoryAccount;
  className?: string;
}) => {
  const { id, display, judgement } = account;
  const { avatar, address } = useWallet();
  const { isOpen, sendToAddress } = useSendPane();

  const handleAccountClick = useCallback(() => {
    if (!id) return false;
    if (isOpen) sendToAddress(id);
    else copyToClipboard(id);
    return false;
  }, [id, isOpen, sendToAddress]);

  return (
    <button
      className={clsx("flex align-middle gap-2", className)}
      onClick={handleAccountClick}
    >
      <div className="flex flex-col justify-center">
        {id === address && avatar ? (
          <img width={24} height={24} src={avatar} alt="" />
        ) : (
          <Identicon value={id} size={24} theme="polkadot" />
        )}
      </div>
      <div className={clsx("flex flex-col justify-center")}>
        <Address
          keep={6}
          address={id}
          display={display}
          judgement={judgement}
        />
      </div>
    </button>
  );
};

type TransactionListItemProps = {
  tx: HistoryTx;
};

const DistanceToNow = ({ timestamp }: { timestamp: string }) => {
  const [text, setText] = useState(() =>
    formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setText(formatDistanceToNow(new Date(timestamp), { addSuffix: true }));
    }, 60_000);
    return () => {
      clearInterval(interval);
    };
  }, [timestamp]);

  return <>{text}</>;
};

const TransactionListItem = ({ tx }: TransactionListItemProps) => {
  return (
    <div className="bg-zinc-800 even:bg-zinc-700 sm:even:bg-zinc-800 p-4 py-3 flex gap-4 items-center  sm:rounded">
      <div>
        <TokenIcon className="h-12 w-12 sm:h-16 sm:w-16" symbol={tx.currency} />
      </div>
      <div className="grow grid font-bold gap-y-2 gap-x-4 sm:grid-cols-[1fr_24px_1fr]">
        <div className="sm:flex sm:justify-end">
          <TransactionAccount account={tx.from} />
        </div>
        <div className="hidden sm:flex flex-col justify-center">
          <ArrowRightIcon className="w-5 h-5" />
        </div>
        <div>
          <TransactionAccount account={tx.to} />
        </div>
        <div className="font-normal sm:col-span-3 sm:text-center text-zinc-400 text-sm">
          <DistanceToNow timestamp={tx.timestamp} />
        </div>
      </div>
      <div className="hidden sm:block sm:invisible sm:min-w-[64px]">
        {/* placeholder to ensure same size as left one */}
      </div>
    </div>
  );
};

type TransactionsListProps = {
  address?: string;
};

export const TransactionsList: FC<TransactionsListProps> = ({ address }) => {
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useTransactions(address);

  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "10%",
    threshold: 0.9,
  });

  useEffect(() => {
    if (isFetching || isFetchingNextPage || !hasNextPage) return;
    if (intersection && intersection.intersectionRatio >= 0.9) fetchNextPage();
  }, [
    fetchNextPage,
    hasNextPage,
    intersection,
    isFetching,
    isFetchingNextPage,
  ]);

  if (error)
    return (
      <div className="bg-red-500 text-white p-2 py-4 rounded whitespace-pre-wrap text-lg font-medium">
        {error.toString()}
      </div>
    );

  return (
    <>
      <div className="flex flex-col sm:gap-2 max-w-full overflow-hidden">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.transfersConnection.edges?.map(({ node }) => (
              <TransactionListItem key={node.id} tx={node} />
            ))}
          </Fragment>
        ))}
      </div>
      <div
        ref={intersectionRef}
        className={clsx(
          isFetching || hasNextPage ? "visible" : "hidden",
          "flex w-full justify-center py-4 animate-spin"
        )}
      >
        <Spinner className={clsx("w-8 h-8 animate-spin")} />
      </div>
    </>
  );
};
