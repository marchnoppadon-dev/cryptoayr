import { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";

const BASE_URL = "https://www.cryptoayr.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: news } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("vertical", "crypto")
    .eq("pillar", "news")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const newsUrls: MetadataRoute.Sitemap = (news ?? []).map((n) => ({
    url: BASE_URL + "/crypto/news/" + n.slug,
    lastModified: n.updated_at ? new Date(n.updated_at) : new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: BASE_URL + "/crypto/news",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  return [...staticUrls, ...newsUrls];
}