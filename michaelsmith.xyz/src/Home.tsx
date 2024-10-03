import { assetRef } from './middleware/assets.ts';

export const Home = () => {
  const currentYear = (new Date()).getFullYear();

  return (
    <html lang='en' class='h-full'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        <title>Michael Smith</title>

        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap'
          rel='stylesheet'
        />
        <link rel='stylesheet' href={assetRef('/css/fontawesome.min.css')} />
        <link rel='stylesheet' href={assetRef('/css/brands.min.css')} />
        <link rel='stylesheet' href={assetRef('/css/solid.min.css')} />
        <link rel='stylesheet' href={assetRef('/styles.css')} />
      </head>
      <body className='
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
        <header className='mt-52 font-display'>
          <picture className='hidden lg:inline-block w-28 h-28 -ml-40 -mt-4 float-left'>
            <source srcSet={assetRef('/me-circle.webp')} type='image/webp' />
            <img src={assetRef('/me-circle.png')} alt='Profile Image' />
          </picture>
          <h1 className='font-bold text-5xl sm:text-7xl mb-8 text-center'>
            Michael Smith
          </h1>
          <nav>
            <ul className='
                list-none
                flex flex-col
                items-center
                sm:flex-row sm:justify-center
                text-xl
            '>
              <li>
                <a
                  className='no-underline hover:text-blue-500 transition-all'
                  href='mailto:me@michaelsmith.xyz'
                >
                  me@michaelsmith.xyz
                </a>
                <span className='ml-2 font-light hidden sm:inline'>•</span>
              </li>
              <li className='mt-6 sm:mt-0 sm:ml-3 sm:inline-flex sm:items-center'>
                <a
                  className='
                    no-underline
                    sm:text-3xl
                    hover:text-blue-500
                    transition-all
                  '
                  href='https://github.com/michaelsmithxyz'
                >
                  <i className='fab fa-github-square'></i>
                  <span className='sm:hidden'>GitHub</span>
                </a>

                <span className='ml-3 font-light hidden sm:inline'>•</span>
              </li>
              <li className='mt-6 sm:mt-0 sm:ml-3 sm:inline-flex sm:items-center'>
                <a
                  className='
                    no-underline
                    sm:text-3xl
                    hover:text-blue-500
                    transition-all
                  '
                  href='https://linkedin.com/in/michaelsmithxyz'
                >
                  <i className='fab fa-linkedin'></i>
                  <span className='sm:hidden'>LinkedIn</span>
                </a>

                <span className='font-light hidden sm:inline ml-3'>•</span>
              </li>
              <li className='mt-6 sm:mt-0 sm:ml-3 sm:inline-flex sm:items-center'>
                <a
                  className='
                    font-medium
                    p-1
                    border border-solid border-blue-500
                    text-blue-500
                    rounded-md
                    hover:text-blue-600 hover:border-blue-600
                    transition-all
                  '
                  href={assetRef('resume-michael-smith-current.pdf')}
                >
                  Résumé
                </a>
              </li>
            </ul>
          </nav>
        </header>
        <footer className='
            font-display
            mt-7
            mb-2
            justify-self-autoflex-shrink-0
            text-gray-400 text-sm
        '>
          © {currentYear} Michael Smith
          <span className='font-light'>•</span>
          <a
            className='underline'
            href='https://github.com/michaelsmithxyz/michaelsmith.xyz'
          >
            Source on GitHub
          </a>
        </footer>
      </body>
    </html>
  );
};
