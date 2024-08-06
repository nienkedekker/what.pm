const link = "font-medium text-blue-600 dark:text-blue-200 hover:underline";
const par = "font-sans leading-6 text-gray-700 dark:text-gray-200 m-2";

export default async function Home() {
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

    </>
  );
}
