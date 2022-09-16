import { Address } from "../../components/Address";
import { useWallet } from "../../lib/WalletContext";
import { useRegistrar } from "./useIsRegistrar";
import { useRegistrars } from "./useRegistrars";
import { Fragment } from "react";

export const IdentityRegistrars = () => {
  const { address } = useWallet();
  const { data } = useRegistrars();
  const { registrar, index } = useRegistrar(address);

  console.log({ registrar: registrar?.toHuman(), index });

  if (!data || index === -1) return null;

  return (
    <div>
      <div>
        {data
          .filter((r) => r.isSome)
          .map((r, i, arr) => (
            <Fragment key={r.value?.account.toString() ?? i}>
              {r.value ? (
                <div>
                  {arr.indexOf(r)}{" "}
                  <Address address={r.value.account.toString()} />
                </div>
              ) : null}
            </Fragment>
          ))}
      </div>
    </div>
  );
};
