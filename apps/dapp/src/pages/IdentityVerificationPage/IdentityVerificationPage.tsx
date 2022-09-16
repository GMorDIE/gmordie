import { Layout } from "../../components/Layout";
import { IdentityRegistrars } from "./IdentityRegistrars";
import { IdentityVerificationForm } from "./IdentityVerificationForm";

export const IdentityVerificationPage = () => {
  return (
    <Layout title="ID Verification" noPadding>
      <div className="container mx-auto max-w-2xl md:py-4">
        <div className="text-white text-center py-8">
          <h1 className="text-3xl uppercase font-light">
            <span className="font-black ">ID</span> Verification
          </h1>
        </div>
        <IdentityVerificationForm />
        {/* <IdentityRegistrars /> */}
      </div>
    </Layout>
  );
};
