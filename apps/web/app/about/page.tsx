import { ReactNode } from "react";

export default async function AboutPage({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto container">
      I (<a href="https://nienke.dev">Nienke</a>) like to log what I read and
      watch in a year :) find the source code for this app{" "}
      <a href="https://github.com/nienkedekker/whatpm-2025">here</a>.
    </main>
  );
}
