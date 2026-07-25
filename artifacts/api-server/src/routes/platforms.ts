import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { platformConnectionsTable } from "@workspace/db";
import {
  ListPlatformsResponse,
  ConnectPlatformBody,
  ConnectPlatformResponse,
  GetPlatformParams,
  GetPlatformResponse,
  DisconnectPlatformParams,
  ReconnectPlatformParams,
  ReconnectPlatformResponse,
} from "@workspace/api-zod";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

const router: IRouter = Router();

const defaultCapabilities: Record<string, string[]> = {
  facebook: ["text", "images", "video", "links", "stories"],
  instagram: ["images", "video", "reels", "stories"],
  linkedin: ["text", "images", "video", "articles", "links"],
  tiktok: ["video"],
  youtube: ["video", "shorts"],
  twitter: ["text", "images", "video", "links"],
  google_business: ["text", "images", "video", "links"],
  email: ["text", "images", "links"],
  blog: ["text", "images", "video", "links"],
};

router.get("/platforms", async (_req, res, next) => {
  try {
    const items = await db.query.platformConnectionsTable.findMany({
      orderBy: (platform, { asc }) => [asc(platform.platform)],
    });

    const groups = [
      { id: "all", name: "All Platforms", platforms: items.map((p) => p.platform) },
      { id: "social", name: "All Social", platforms: ["facebook", "instagram", "linkedin", "tiktok", "twitter"] },
      { id: "professional", name: "Professional", platforms: ["linkedin", "blog"] },
      { id: "video", name: "Video", platforms: ["tiktok", "youtube"] },
      { id: "local", name: "Local Marketing", platforms: ["google_business", "facebook"] },
    ];

    const data = ListPlatformsResponse.parse({ items, groups });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/platforms", async (req, res, next) => {
  try {
    const body = ConnectPlatformBody.parse(req.body);
    const id = randomUUID();
    const now = new Date();

    const [inserted] = await db
      .insert(platformConnectionsTable)
      .values({
        id,
        platform: body.platform,
        connected: true,
        profile: body.profile ?? "Connected account",
        permissions: ["publish", "read"],
        capabilities: defaultCapabilities[body.platform] ?? ["text"],
        lastSync: now,
        tokenExpiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: "connected",
      })
      .returning();

    const data = ConnectPlatformResponse.parse(inserted);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/platforms/:id", async (req, res, next) => {
  try {
    const params = GetPlatformParams.parse(req.params);
    const item = await db.query.platformConnectionsTable.findFirst({
      where: eq(platformConnectionsTable.id, params.id),
    });

    if (!item) {
      res.status(404).json({ error: "Platform not found" });
      return;
    }

    const data = GetPlatformResponse.parse(item);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.delete("/platforms/:id", async (req, res, next) => {
  try {
    const params = DisconnectPlatformParams.parse(req.params);
    await db
      .delete(platformConnectionsTable)
      .where(eq(platformConnectionsTable.id, params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.post("/platforms/:id/reconnect", async (req, res, next) => {
  try {
    const params = ReconnectPlatformParams.parse(req.params);
    const now = new Date();

    const [updated] = await db
      .update(platformConnectionsTable)
      .set({
        connected: true,
        status: "connected",
        lastSync: now,
        tokenExpiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      })
      .where(eq(platformConnectionsTable.id, params.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Platform not found" });
      return;
    }

    const data = ReconnectPlatformResponse.parse(updated);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
