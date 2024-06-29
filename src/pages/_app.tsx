// src/pages/_app.tsx
import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { PublicKey } from "@solana/web3.js";
import { ThemeProvider } from "@/components/theme-provider";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";

const TokenMetaProvider = dynamic(
  () => import("gamba-react-ui-v2").then((mod) => mod.TokenMetaProvider),
  { ssr: false }
);

const GambaProvider = dynamic(
  () => import("gamba-react-v2").then((mod) => mod.GambaProvider),
  { ssr: false }
);

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

const SOLANA = [
  {
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    name: "Solana",
    symbol: "SOL",
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    decimals: 9,
    baseWager: 0.01e9,
  },
];

function MyApp({ Component, pageProps }: AppProps) {
  const RPC_ENDPOINT =
    process.env.NEXT_PUBLIC_HELIUS_RPC_URL ||
    "https://api.mainnet-beta.solana.com";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <ConnectionProvider
        endpoint={RPC_ENDPOINT}
        config={{ commitment: "processed" }}
      >
        <WalletProvider autoConnect wallets={[]}>
          <WalletModalProvider>
            <TokenMetaProvider tokens={SOLANA}>
              <GambaProvider>
                <DefaultSeo {...BASE_SEO_CONFIG} />
                <Component {...pageProps} />
              </GambaProvider>
            </TokenMetaProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
