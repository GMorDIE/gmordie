import clsx from "clsx";
import { AnchorHTMLAttributes } from "react";

import {
  IconDiscord,
  IconLeaderboard,
  IconSubsocial,
  IconTwitter,
  IconWallet,
} from "../assets/social";

const THE_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const Link = ({
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
      <Link
        href={THE_URL}
        className="opacity-50"
        title="Leaderboard - coming soon"
      >
        <IconLeaderboard />
      </Link>
      <Link href={"https://talisman.xyz/"} title="Talisman">
        <IconWallet />
      </Link>
      <Link href={"https://discord.gg/JFzD2b5P2B"} title="Join us on Discord !">
        <IconDiscord />
      </Link>
      <Link href={"https://app.subsocial.network/6882"} title="Subsocial">
        <IconSubsocial />
      </Link>
      <Link
        href={"https://twitter.com/GmOrDie_"}
        className="text-salmon hover:text-salmon-300"
        title="Twitter"
      >
        <IconTwitter />
      </Link>
    </div>
  );
};
