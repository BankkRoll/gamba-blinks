// src/pages/_app.tsx
import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { DefaultSeo } from "next-seo";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { AppProps } from "next/app";
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
  // Retrieve and validate RPC endpoint
  const RPC_ENDPOINT = (() => {
    const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
    if (!endpoint) {
      throw new Error(
        "NEXT_PUBLIC_RPC_ENDPOINT environment variable is not set",
      );
    }
    return endpoint;
  })();

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
