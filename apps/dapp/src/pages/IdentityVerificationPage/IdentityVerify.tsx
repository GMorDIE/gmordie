import { Button } from "../../components/Button";
import { useIdentityVerify } from "./useIdentityVerify";

type IdentityVerifyProps = {
  address: string;
};

export const IdentityVerifyButton = ({ address }: IdentityVerifyProps) => {
  const { canVerify, verify } = useIdentityVerify(address);

  if (!canVerify) return null;

  return <Button onClick={verify}>Verify</Button>;
};
