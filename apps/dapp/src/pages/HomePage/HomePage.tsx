import { ReactComponent as ArrowIcon } from "../../assets/arrow.svg";
import { Balances } from "../../components/Balances";
import { BurnButton } from "../../components/BurnButton";
import { Layout } from "../../components/Layout";
import { SocialLinks } from "../../components/SocialLinks";
import { Wheel } from "../../components/Wheel";

export const HomePage = () => {
  return (
    <Layout>
      <div className="container py-4 mx-auto max-w-3xl md:py-8">
        {/* horizontal layout on desktop, vertical on mobile */}
        <div className="grid-cols-1 w-full text-center md:grid md:grid-cols-2">
          {/* Block 1 */}
          <div className="inline-block flex-col justify-center p-4 w-80 max-w-full text-left text-white sm:p-8 md:flex md:w-auto">
            <div className="flex flex-col justify-end md:h-36">
              <h1 className="text-6xl font-black">GM!</h1>
              <p className="w-64 max-w-full text-3xl font-medium uppercase">
                Mint your own and say it back
              </p>
            </div>
            <BurnButton />
            <div className="md:h-36">
              <Balances />
            </div>
          </div>
          {/* Block 2 */}
          <div className="flex flex-col items-center md:flex-row">
            <ArrowIcon className="h-16 md:rotate-[270deg]" />
            <Wheel className="md:w-80 md:h-80 md:rotate-[270deg]" />
          </div>
        </div>
        <SocialLinks />
      </div>
    </Layout>
  );
};
