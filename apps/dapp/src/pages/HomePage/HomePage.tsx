import { ReactComponent as ArrowIcon } from "../../assets/arrow.svg";
import { Balances } from "../../components/Balances";
import { BurnButton } from "../../components/BurnButton";
import { Layout } from "../../components/Layout";
import { Wheel } from "../../components/Wheel";
import { useGmTime } from "../../lib/GmTimeContext";
import { GMGNGrandTotal } from "./GMGNGrandTotal";
import clsx from "clsx";

export const HomePage = () => {
  const { time } = useGmTime();

  return (
    <Layout requiresTime title="Say it back!">
      <div className="container py-4 mx-auto max-w-3xl md:py-8 min-h-full overflow-x-hidden">
        {/* horizontal layout on desktop, vertical on mobile */}
        <div className="flex w-full text-center flex-col md:flex-row justify-center items-center mt-8">
          {/* Block 1 */}
          <div
            className={clsx(
              "overflow-hidden transition-all relative",
              time
                ? "opacity-100 w-80 h-[370px] md:h-[424px]"
                : "w-0 h-0 opacity-0 md:h-[424px]"
            )}
          >
            <div className="absolute top-0 left-0 flex flex-col justify-center text-left text-white w-80  md:w-80 p-4 sm:p-8 min-w-fit h-[424px]">
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
          </div>
          {/* Block 2 */}
          <div className="flex flex-col items-center md:flex-row h-[424px]">
            <div
              className={clsx(
                "transition-all ",
                time
                  ? "opacity-100 overflow-visible w-fit h-fit"
                  : "opacity-0 overflow-hidden w-0 h-0"
              )}
            >
              <ArrowIcon className={"md:rotate-[270deg] w-16 "} />
            </div>
            <Wheel className="xs:w-80 xs:h-80 md:rotate-[270deg]" />
          </div>
        </div>
        <GMGNGrandTotal />
      </div>
    </Layout>
  );
};
