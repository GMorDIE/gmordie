import { Layout } from "../../components/Layout";
import { useForceDocumentScroll } from "../../lib/useForceDocumentScroll";
import { IdentityVerificationForm } from "./IdentityVerificationForm";

export const IdentityVerificationPage = () => {
  useForceDocumentScroll();

  return (
    <Layout title="ID Verification" noPadding>
      <div className="container mx-auto max-w-2xl md:py-4">
        <div className="text-white text-center py-8">
          <h1 className="text-3xl uppercase font-light">
            <span className="font-black ">GM</span> ID Verification
          </h1>
        </div>
        <IdentityVerificationForm />
      </div>
    </Layout>
  );
};
