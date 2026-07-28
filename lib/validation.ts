import { z } from "zod";

export const scriptInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().min(1, "Description is required").max(2000),
  category: z.string().min(1, "Category is required").max(60),
  tags: z.array(z.string()).default([]),
  pricing: z.enum(["free", "paid"]),
  downloadUrl: z.string().url("Must be a valid URL"),
  linkType: z.enum(["pastebin", "linkvertise", "direct", "other"]),
  featured: z.boolean().optional(),
  version: z.string().optional(),
  changelog: z.string().optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const discordSettingsSchema = z.object({
  discordUrl: z
    .string()
    .trim()
    .refine(
      (val) =>
        val === "" ||
        /^https:\/\/(discord\.gg|discord\.com\/invite)\/.+/i.test(val),
      "Use a valid Discord invite link (discord.gg/... or discord.com/invite/...)"
    ),
});
