import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MuseoModerno } from "next/font/google";

import { api } from "~/utils/api";


import "~/styles/globals.css";

const main = MuseoModerno({ subsets: ['latin'] })

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <main className={`${main.className}`}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
