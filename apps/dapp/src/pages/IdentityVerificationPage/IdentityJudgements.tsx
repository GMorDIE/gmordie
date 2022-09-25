import { IconButton } from "../../components/IconButton";
import { IdentityJudgement } from "./IdentityJudgement";
import { IdentityVerification } from "./useIdentityVerification";
import { JudgementType, useIdentityVerify } from "./useIdentityVerify";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import { Registration } from "@polkadot/types/interfaces/identity";
import clsx from "clsx";
import { Fragment, useCallback } from "react";

type IdentityVerificationProps = IdentityVerification & {
  address: string;
};

const StatusIcon = ({ registration }: { registration: Registration }) => {
  let className = "";
  if (registration?.judgements?.some(([, j]) => j.isKnownGood)) {
    className = "text-green-600";
  } else if (registration?.judgements?.some(([, j]) => j.isReasonable))
    className = "";
  else className = "text-red-500";

  return <ShieldCheckIcon className={clsx("inline w-6 h-6 mb-1", className)} />;
};

const IdentityJudgementStatus = ({
  registration,
  judges,
  className,
}: Pick<IdentityVerificationProps, "judges" | "registration"> & {
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "font-bold text-white leading-7 align-middle ",
        className
      )}
    >
      {judges.length ? (
        <>
          <StatusIcon registration={registration} />
          <span>
            {" "}
            Judged by{" "}
            {judges?.map((judge, i, arr) => (
              <Fragment key={i + judge.registrar.account.toString()}>
                {i > 0 && arr.length === i + 1 && " and "}
                {i > 0 && arr.length > i + 1 && ", "}
                <IdentityJudgement judge={judge} registration={registration} />
              </Fragment>
            ))}
          </span>
        </>
      ) : (
        <>
          <StatusIcon registration={registration} /> No judgement
        </>
      )}
    </div>
  );
};

const IdentityJudgementActions = ({
  address,
  registration,
}: IdentityVerificationProps) => {
  const { canVerify, verify, judgement } = useIdentityVerify(
    registration,
    address
  );

  const handleVerify = useCallback(
    (type: JudgementType) => () => {
      if (type !== judgement) verify(type);
    },
    [judgement, verify]
  );

  if (!canVerify || registration?.isEmpty) return null;

  return (
    <div className="flex gap-1 items-middle">
      <div>
        <IconButton
          onClick={handleVerify("Unknown")}
          checked={judgement === "Unknown"}
          title="Unknown"
        >
          <ShieldCheckIcon className="w-4 h-4 text-red-500" />
        </IconButton>
      </div>
      <div>
        <IconButton
          onClick={handleVerify("Reasonable")}
          checked={judgement === "Reasonable"}
          title="Reasonable"
        >
          <ShieldCheckIcon className="w-4 h-4" />
        </IconButton>
      </div>
      <div>
        <IconButton
          onClick={handleVerify("KnownGood")}
          checked={judgement === "KnownGood"}
          title="Known Good"
        >
          <ShieldCheckIcon className="w-4 h-4 text-green-500" />
        </IconButton>
      </div>
    </div>
  );
};

export const IdentityJudgements = ({
  address,
  registration,
  judges: knownGoodRegistrars,
}: IdentityVerificationProps) => {
  return (
    <div className="flex items-center h-10">
      <IdentityJudgementStatus
        className="grow"
        registration={registration}
        judges={knownGoodRegistrars}
      />
      <IdentityJudgementActions
        registration={registration}
        address={address}
        judges={knownGoodRegistrars}
      />
    </div>
  );
};
