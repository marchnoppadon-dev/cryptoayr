import { config } from "dotenv";
config({ path: ".env.local" });

const CG_BASE = "https://api.coingecko.com/api/v3";
const CG_API_KEY = process.env.COINGECKO_API_KEY!;

async function cgFetch(path: string, params: Record<string, string> = {}) {
  const url = new URL(CG_BASE + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: { "x-cg-demo-api-key": CG_API_KEY },
  });
  if (!res.ok) {
    throw new Error("CoinGecko " + path + " failed: " + res.status + " " + (await res.text()));
  }
  return res.json();
}

export interface CoinBundle {
  detail: any;
  tickers: any;
}

export async function fetchCoinBundle(coingeckoId: string): Promise<CoinBundle> {
  const detail = await cgFetch("/coins/" + coingeckoId, {
    localization: "false",
    tickers: "true",
    market_data: "true",
    community_data: "false",
    developer_data: "false",
  });
  return {
    detail: detail,
    tickers: detail.tickers,
  };
}

export function extractLogoUrl(detail: any): string | null {
  return detail?.image?.large || detail?.image?.small || null;
}

export function extractExchangeNames(tickers: any): string[] {
  if (!tickers || !Array.isArray(tickers)) return [];
  const names = tickers.map((t: any) => t.market?.name).filter(Boolean);
  return Array.from(new Set(names));
}

export async function fetchTopCoins(page = 1) {
  return cgFetch("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: "50",
    page: String(page),
    sparkline: "false",
  });
}

export async function fetchCoinsByExchange(exchangeId: string, page = 1) {
  return cgFetch("/exchanges/" + exchangeId + "/tickers", {
    page: String(page),
  });
}
export async function fetchBitcoinPrice() {
  const data = await cgFetch("/simple/price", {
    ids: "bitcoin",
    vs_currencies: "usd",
    include_24hr_change: "true",
  });
  return {
    price: data.bitcoin.usd as number,
    change24h: data.bitcoin.usd_24h_change as number,
  };
}