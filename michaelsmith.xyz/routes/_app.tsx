import { asset } from '$fresh/runtime.ts';
import { type PageProps } from '$fresh/server.ts';

export default function App({ Component }: PageProps) {
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
        <link rel='stylesheet' href={asset('/css/fontawesome.min.css')} />
        <link rel='stylesheet' href={asset('/css/brands.min.css')} />
        <link rel='stylesheet' href={asset('/css/solid.min.css')} />
        <link rel='stylesheet' href={asset('/styles.css')} />
      </head>
      <Component />
    </html>
  );
}
