// src/pages/_app.tsx
import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import { AppProps } from "next/app";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "@/components/theme-provider";

const BASE_SEO_CONFIG = {
  defaultTitle: "Gamba Blinks",
  description: "Play Coin Flip On-Chain Anywhere With Gamba Blinks!",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamba-blinks.vercel.app",
    title: "Gamba Blinks",
    description: "Play Coin Flip On-Chain Anywhere With Gamba Blinks!",
    images: [
      {
        url: "https://gamba-blinks.vercel.app/logo.png",
        alt: "Gamba Blinks",
      },
    ],
    site_name: "Gamba Blinks",
  },
  twitter: {
    cardType: "summary_large_image",
    site: "",
    handle: "",
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  const RPC_ENDPOINT =
    (process.env.NEXT_PUBLIC_HELIUS_RPC_URL as string) ||
    "https://api.mainnet-beta.solana.com";

  return (
    <ConnectionProvider
      endpoint={RPC_ENDPOINT}
      config={{ commitment: "processed" }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <DefaultSeo {...BASE_SEO_CONFIG} />
        <Component {...pageProps} />
      </ThemeProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
