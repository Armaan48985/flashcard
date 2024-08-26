// import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
// import { cookieStorage, createStorage } from "wagmi";
// import { polygon } from "wagmi/chains";


// export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// if (!projectId) throw new Error("Project ID is not defined");

// const metadata = {
//   name: "Web3Modal",
//   description: "Web3Modal Example",
//   url: "https://web3modal.com",
//   icons: ["https://avatars.githubusercontent.com/u/37784886"],
// };

// // Create wagmiConfig
// const chains = [polygon] as const;
// export const config = defaultWagmiConfig({
//   chains,
//   projectId,
//   metadata,
//   ssr: true,
//   storage: createStorage({
//     storage: cookieStorage,
//   }),
// });