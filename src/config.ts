export const AUTH_API_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://127.0.0.1:8001";

export const CATALOG_API_URL =
  import.meta.env.VITE_CATALOG_API_URL || "http://127.0.0.1:8002";

export const SALES_API_URL =
  import.meta.env.VITE_SALES_API_URL || "http://127.0.0.1:8003";

const normalizePath = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

export const authUrl = (path: string) =>
  `${AUTH_API_URL}${normalizePath(path)}`;

export const catalogUrl = (path: string) =>
  `${CATALOG_API_URL}${normalizePath(path)}`;

export const salesUrl = (path: string) =>
  `${SALES_API_URL}${normalizePath(path)}`;

