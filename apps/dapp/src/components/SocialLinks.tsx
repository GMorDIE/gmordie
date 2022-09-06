import {
  IconDiscord,
  IconLeaderboard,
  IconSubsocial,
  IconTwitter,
  IconWallet,
} from "../assets/social";
import clsx from "clsx";
import { AnchorHTMLAttributes, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const LinkButton = ({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    {...props}
    className={clsx(
      className,
      "text-salmon hover:text-salmon-300 cursor-pointer"
    )}
  >
    {children}
  </a>
);

export const SocialLinks = ({ show }: { show: boolean }) => {
  const navigate = useNavigate();

  const handleLinkClick = useCallback(
    (to: string) => () => {
      navigate(to);
    },
    [navigate]
  );

  return (
    <div
      className={clsx(
        "flex gap-3 justify-center opacity-0 transition-opacity",
        show && "opacity-100"
      )}
    >
      <LinkButton
        onClick={handleLinkClick("/leaderboard")}
        title="Leaderboard - coming soon"
      >
        <IconLeaderboard />
      </LinkButton>
      <LinkButton href={"https://talisman.xyz/"} title="Talisman">
        <IconWallet />
      </LinkButton>
      <LinkButton
        href={"https://discord.gg/JFzD2b5P2B"}
        title="Join us on Discord !"
      >
        <IconDiscord />
      </LinkButton>
      <LinkButton href={"https://app.subsocial.network/6882"} title="Subsocial">
        <IconSubsocial />
      </LinkButton>
      <LinkButton
        href={"https://twitter.com/GmOrDie_"}
        className="text-salmon hover:text-salmon-300"
        title="Twitter"
      >
        <IconTwitter />
      </LinkButton>
    </div>
  );
};
