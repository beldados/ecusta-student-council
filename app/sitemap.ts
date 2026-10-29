import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ecusta-student-council.vercel.app";
  return ["", "/about", "/council", "/clubs", "/announcements", "/mentorship", "/events", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: "2026-10-27",
  }));
}
