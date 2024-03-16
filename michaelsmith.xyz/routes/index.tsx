import { asset } from '$fresh/runtime.ts';

export default function Home() {
  const currentYear = (new Date()).getFullYear();

  return (
    <body class='
        flex flex-col
        justify-between
        items-center
        w-full
        h-full
        container
        mx-auto
        font-sans
        text-gray-700
      '>
      <header class='mt-52 font-display'>
        <picture class='hidden lg:inline-block w-28 h-28 -ml-40 -mt-4 float-left'>
          <source srcset={asset('/me-circle.webp')} type='image/webp' />
          <img src={asset('/me-circle.png')} alt='Profile Image' />
        </picture>
        <h1 class='font-bold text-5xl sm:text-7xl mb-8 text-center'>
          Michael Smith
        </h1>
        <nav>
          <ul class='
              list-none
              flex flex-col
              items-center
              sm:flex-row sm:justify-center
              text-xl
            '>
            <li>
              <a
                class='no-underline hover:text-blue-500 transition-all'
                href='mailto:me@michaelsmith.xyz'
              >
                me@michaelsmith.xyz
              </a>
              <span class='ml-2 font-light hidden sm:inline'>•</span>
            </li>
            <li class='mt-6 sm:mt-0 sm:ml-3 sm:inline-flex sm:items-center'>
              <a
                class='
                  no-underline
                  sm:text-3xl
                  hover:text-blue-500
                  transition-all
                '
                href='https://github.com/michaelsmithxyz'
              >
                <i class='fab fa-github-square'></i>
                <span class='sm:hidden'>GitHub</span>
              </a>

              <span class='ml-3 font-light hidden sm:inline'>•</span>
            </li>
            <li class='mt-6 sm:mt-0 sm:ml-3 sm:inline-flex sm:items-center'>
              <a
                class='
                  no-underline
                  sm:text-3xl
                  hover:text-blue-500
                  transition-all
                '
                href='https://linkedin.com/in/michaelsmithxyz'
              >
                <i class='fab fa-linkedin'></i>
                <span class='sm:hidden'>LinkedIn</span>
              </a>

              <span class='font-light hidden sm:inline ml-3'>•</span>
            </li>
            <li class='mt-6 sm:mt-0 sm:ml-3 sm:inline-flex sm:items-center'>
              <a
                class='
                  font-medium
                  p-1
                  border border-solid border-blue-500
                  text-blue-500
                  rounded-md
                  hover:text-blue-600 hover:border-blue-600
                  transition-all
                '
                href={asset('resume-michael-smith-current.pdf')}
              >
                Résumé
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <footer class='
          font-display
          mt-7
          mb-2
          justify-self-autoflex-shrink-0
          text-gray-400 text-sm
        '>
        © {currentYear} Michael Smith
        <span class='font-light'>•</span>
        <a
          class='underline'
          href='https://github.com/michaelsmithxyz/michaelsmith.xyz'
        >
          Source on GitHub
        </a>
      </footer>
    </body>
  );
}
