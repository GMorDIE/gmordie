import {
  IconBip,
  IconDiscord,
  IconLeaderboard,
  IconSubsocial,
  IconTwitter,
  IconWallet,
  IconYoutube,
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
      <LinkButton onClick={handleLinkClick("/leaderboard")} title="Leaderboard">
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
      <LinkButton
        href={"https://www.youtube.com/channel/UChMjLOYCSZqEABkB_RfOC1Q"}
        className="text-salmon hover:text-salmon-300"
        title="Youtube"
      >
        <IconYoutube />
      </LinkButton>
      <LinkButton
        href={"https://bip.so/@gmordie/What-is-the-GM-Parachain-LxOBJ"}
        className="text-salmon hover:text-salmon-300"
        title="Build In Public"
      >
        <IconBip />
      </LinkButton>
    </div>
  );
};
