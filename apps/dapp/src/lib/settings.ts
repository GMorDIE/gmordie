export const APP_NAME: string = import.meta.env.VITE_APP_NAME;

export const SUBSQUID_URL: string = import.meta.env.VITE_SUBSQUID_URL;

// RPC urls are separated by commas
const rpcUrls: string = import.meta.env.VITE_WS_RPC_URLS;
export const WS_RPC_URLS = rpcUrls.split(",").map((str) => str.trim());
