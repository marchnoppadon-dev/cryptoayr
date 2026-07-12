import { config } from "dotenv";
config({ path: ".env.local" });

const CC_BASE = "https://min-api.cryptocompare.com/data/v2";
const CC_API_KEY = process.env.CRYPTOCOMPARE_API_KEY!;

async function ccFetch(path: string, params: Record<string, string> = {}) {
  const url = new URL(CC_BASE + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: { authorization: "Apikey " + CC_API_KEY },
  });
  if (!res.ok) {
    throw new Error("CryptoCompare " + path + " failed: " + res.status + " " + (await res.text()));
  }
  return res.json();
}

export interface NewsArticle {
  id: string;
  title: string;
  body: string;
  url: string;
  source: string;
  publishedAt: number;
  categories: string;
  imageUrl: string | null;
}

export async function fetchLatestNews(categories = "BTC,ETH,Trading"): Promise<NewsArticle[]> {
  const data = await ccFetch("/news/", {
    lang: "EN",
    categories: categories,
  });
  const list = data.Data || [];
  return list.map((item: any) => ({
    id: String(item.id),
    title: item.title,
    body: item.body,
    url: item.url,
    source: item.source_info?.name || item.source,
    publishedAt: item.published_on,
    categories: item.categories,
    imageUrl: item.imageurl || null,
  }));
}