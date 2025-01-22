export default function About() {
  return (
    <div className="relative isolate overflow-hidden py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.900),theme(colors.gray.900))] opacity-20" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl text-center">
            About Me
          </h1>
          
          <div className="mt-12 text-lg leading-8 text-gray-600 dark:text-gray-400 space-y-8">
            <p>
              👋 Hi! I'm Nawaz, a passionate Full Stack Web Developer with a knack for creating user-friendly applications
              that solve real-world problems.
            </p>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Why I Built This Resume Builder
              </h2>
              <p>
                As a developer who's been through countless job applications, I know how tedious resume creation can be.
                I built this tool to make the process painless and even fun! No more wrestling with formatting or
                wondering what to include - just fill in your details and let the app do the heavy lifting.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                My Tech Stack
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Frontend: React, Next.js, TypeScript, Tailwind CSS</li>
                <li>Backend: Node.js, Express, Python, Django</li>
                <li>Databases: MongoDB, PostgreSQL, Redis</li>
                <li>DevOps: Docker, AWS, CI/CD</li>
                <li>Tools: Git, VS Code, Postman</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Let's Connect!
              </h2>
              <p>
                Want to collaborate or just chat about web development? Check out my{' '}
                <a
                  href="https://pmdnawaz1.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  portfolio
                </a>{' '}
                or drop me a message. I'm always excited to connect with fellow developers and tech enthusiasts!
              </p>
            </div>

            <div className="mt-10 flex justify-center">
              <a
                href="https://pmdnawaz1.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Visit My Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
