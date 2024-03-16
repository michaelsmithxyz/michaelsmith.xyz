import { Head } from '$fresh/runtime.ts';

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <header class='font-display'>
        Not found
      </header>
    </>
  );
}
