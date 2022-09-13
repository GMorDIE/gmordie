import { Layout } from "../../components/Layout";
import { useForceDocumentScroll } from "../../lib/useForceDocumentScroll";
import { TransactionsList } from "./TransactionsList";

export const TransactionsPage = () => {
  useForceDocumentScroll();

  return (
    <Layout title="Love History" noPadding>
      <div className="container py-4 mx-auto max-w-3xl md:py-4">
        <TransactionsList />
      </div>
    </Layout>
  );
};
