const fetchMusic = async () => {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=shinyhats&api_key=${process.env.LAST_FM_KEY}&limit=2&extended=1&format=json`,
    {
      cache: "no-store",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

const link = "font-medium text-blue-600 dark:text-blue-200 hover:underline";
const par = "font-sans leading-6 text-gray-700 dark:text-gray-200 m-2";

export default async function Home() {
  const musicData = await fetchMusic();
  const recentTrack = musicData?.recenttracks?.track[0];
  const {
    name: title,
    url,
    artist: { name: artist },
    date,
  } = recentTrack;
  const songTime = typeof date === "undefined" ? "now playing" : "last listened to";

  return (
    <>
      <main className="max-w-3xl mx-auto md:h-screen flex items-center justify-center">
        <section className="flex flex-col md:flex-row gap-6 justify-center items-center ">
          <picture>
            <source media="(max-width: 768px)" srcSet="/moi-landscape.png" />
            <source media="(min-width: 769px)" srcSet="/moi.jpg" />
            <img
              src="/moi.jpg"
              alt="Nienke sitting in a restaurant"
              className="md:rounded-lg max-w-full md:max-w-xs ml-auto mr-auto"
            />
          </picture>
          <div className="m-6 md:m-0">
            <h1 className="mb-4 mx-2 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Hi, I'm Nienke!
            </h1>
            <p className={par}>
              I'm a software developer based in Amsterdam. I've been building websites all my life.
            </p>
            <p className={par}>
              The past three years I've been focused on building complex web apps with React,
              TypeScript, and WebRTC.
            </p>
            <p className={par}>
              To contact me, send me an{" "}
              <a href="mailto:nienkedekker(at)gmail(dot).com" className={link}>
                email
              </a>
              . I'm also on{" "}
              <a href="https://github.com/nienkedekker" className={link}>
                Github
              </a>{" "}
              and{" "}
              <a href="https://www.linkedin.com/in/nienke-dekker-15348ab1/" className={link}>
                LinkedIn
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      {musicData && (
        <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-neutral-900 dark:border-neutral-600">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            <span className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              {songTime}:{" "}
            </span>
            <a href={url} className="font-medium hover:underline">
              {artist} - {title}
            </a>
          </span>
        </footer>
      )}
    </>
  );
}
