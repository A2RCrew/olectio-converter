import { type NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const DynamicNimrodTester = dynamic(() => import('../components/NimrodTester'), {})

const Home: NextPage = () => (
  <>
    <Head>
      <title>The Nimrod Project</title>
      <meta name="description" content="Nimrod PDF To HTML 5 tranformer" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex fixed min-h-screen min-w-full flex-col bg-violet-900 bg-[url('/nimrod.jpg')] bg-cover">
      <div className="container flex flex-col gap-6 px-12 py-12 drop-shadow shadow-black">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          the
          <br />
          <span className="text-rose-600">Nimrod</span>
          <br />
          project
        </h1>
      </div>
      <DynamicNimrodTester />
      <div className="text-xl text-right font-semibold text-white fixed right-6 bottom-5 outlined">
        <div className="inline-block">
          <div className="text-rose-600 tracking-tight font-bold text-6xl px-2">A2R</div>
          <div className="tracking-[0.16em] mr-1 -mt-2">Crew S.L.</div>
        </div>
      </div>
    </main>
  </>
);

export default Home;
