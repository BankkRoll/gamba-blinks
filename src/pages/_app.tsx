// src/pages/_app.tsx
import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

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
  const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";

  return (
    <ConnectionProvider
      endpoint={RPC_ENDPOINT}
      config={{ commitment: "processed" }}
    >
      <WalletProvider autoConnect wallets={[]}>
        <WalletModalProvider>
          <DefaultSeo {...BASE_SEO_CONFIG} />
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
