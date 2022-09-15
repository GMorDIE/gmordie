import { Layout } from "../../components/Layout";
import { useForceDocumentScroll } from "../../lib/useForceDocumentScroll";
import { TransactionsList } from "./TransactionsList";

export const TransactionsPage = () => {
  useForceDocumentScroll();

  return (
    <Layout title="Love History" noPadding>
      <div className="container mx-auto max-w-2xl md:py-4">
        <div className="text-white text-center py-8">
          <h1 className="text-3xl uppercase font-light">
            <span className="font-black ">GM</span> Transactions
          </h1>
        </div>
        <TransactionsList />
      </div>
    </Layout>
  );
};
