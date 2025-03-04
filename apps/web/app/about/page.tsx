import Image from "next/image";
import tumblr from "./tumblr.png";
import Link from "next/link";

export default async function AboutPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Image
        className="rounded-md border"
        src={tumblr}
        style={{
          width: "auto",
          height: "auto",
        }}
        alt="A screenshot of a Tumblr post by user so-many-ocs, with the text '[on the verge of having a complete breakdown] i need to make some kind of list or perhaps sort things into categories'"
      />
      <p>
        I (
        <Link href="https://nienke.dev" className="underline">
          Nienke
        </Link>
        ) like to log what I read and watch in a year :) find the source code
        for this site{" "}
        <Link
          className="underline"
          href="https://github.com/nienkedekker/whatpm-2025"
        >
          here
        </Link>
        .
      </p>
    </div>
  );
}
