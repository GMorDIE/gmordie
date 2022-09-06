import {
  IconDiscord,
  IconLeaderboard,
  IconSubsocial,
  IconTwitter,
  IconWallet,
} from "../assets/social";
import clsx from "clsx";
import { AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";

const LinkButton = ({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    {...props}
    className={clsx(className, "text-salmon hover:text-salmon-300")}
  >
    {children}
  </a>
);

export const SocialLinks = ({ show }: { show: boolean }) => {
  return (
    <div
      className={clsx(
        "flex gap-3 justify-center opacity-0 transition-opacity",
        show && "opacity-100"
      )}
    >
      <Link to="/leaderboard">
        <LinkButton title="Leaderboard - coming soon">
          <IconLeaderboard />
        </LinkButton>
      </Link>
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
