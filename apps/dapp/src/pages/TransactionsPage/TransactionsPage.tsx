import { Layout } from "../../components/Layout";
import { useWallet } from "../../lib/WalletContext";
import { useForceDocumentScroll } from "../../lib/useForceDocumentScroll";
import { TransactionsAddress } from "./TransactionsAddress";
import { TransactionsList } from "./TransactionsList";
import { useState } from "react";

export const TransactionsPage = () => {
  useForceDocumentScroll();

  const { address } = useWallet();
  const [filter, setFilter] = useState(address);

  return (
    <Layout title="Love History" noPadding>
      <div className="container mx-auto max-w-2xl md:py-4">
        <div className="text-white text-center py-8">
          <h1 className="text-3xl uppercase font-light">
            <span className="font-black ">GM</span> Transaction History
          </h1>
        </div>
        <div className="space-y-4">
          <TransactionsAddress defaultValue={address} onChange={setFilter} />
          <TransactionsList address={filter} />
        </div>
      </div>
    </Layout>
  );
};
