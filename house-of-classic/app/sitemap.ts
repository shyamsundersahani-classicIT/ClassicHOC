import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = [
  "",
  "/gallery",
  "/amenities",
  "/splash-relax",
  "/contact",
  "/rules-regulations",
  "/privacy-policy",
  "/cancellation-refund-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: `${site.url}${r || "/"}`, lastModified: new Date(), changeFrequency: "monthly", priority: r === "" ? 1 : 0.7 }));
}
