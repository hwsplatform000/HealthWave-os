import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { medicalVerificationTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod/v4";
import { detectMedicalClaims } from "../lib/research-providers";

const router: IRouter = Router();

// List all verifications
router.get("/medical-verification", async (req, res, next) => {
  try {
    const { status, limit } = z.object({
      status: z.string().optional(),
      limit: z.number().optional().default(20),
    }).parse(req.query);

    let query = db.query.medicalVerificationTable.findMany({
      orderBy: (v, { desc }) => [desc(v.createdAt)],
      limit: limit || 20,
    });

    const items = await query;
    let filtered = items;

    if (status) {
      filtered = filtered.filter(v => v.verificationStatus === status);
    }

    res.json({ items: filtered });
  } catch (err) {
    next(err);
  }
});

// Create verification for content
router.post("/medical-verification", async (req, res, next) => {
  try {
    const body = z.object({
      contentId: z.string().min(1),
      content: z.string().min(1),
      claims: z.array(z.object({
        text: z.string(),
        type: z.enum(["medical_claim", "statistic", "recommendation"]),
        status: z.enum(["verified", "unverified", "flagged"]),
        confidence: z.number().min(0).max(100),
        sources: z.array(z.string()).optional(),
      })).optional().default([]),
      overallConfidence: z.number().min(0).max(100).optional().default(0),
      verificationStatus: z.enum(["pending", "verified", "needs_review", "flagged"]).optional().default("pending"),
      recommendations: z.array(z.string()).optional().default([]),
    }).parse(req.body);

    const id = randomUUID();

    // Auto-detect medical claims if not provided
    let claims = body.claims;
    if (claims.length === 0) {
      const detectedClaims = detectMedicalClaims(body.content);
      claims = detectedClaims.map(claim => ({
        text: claim,
        type: "medical_claim" as const,
        status: "unverified" as const,
        confidence: 0,
      }));
    }

    const [inserted] = await db
      .insert(medicalVerificationTable)
      .values({
        id,
        ...body,
        claims,
      })
      .returning();

    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
});

// Get specific verification
router.get("/medical-verification/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    const item = await db.query.medicalVerificationTable.findFirst({
      where: eq(medicalVerificationTable.id, id),
    });

    if (!item) {
      res.status(404).json({ error: "Verification not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Update verification
router.put("/medical-verification/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({
      claims: z.array(z.any()).optional(),
      overallConfidence: z.number().optional(),
      verificationStatus: z.enum(["pending", "verified", "needs_review", "flagged"]).optional(),
      recommendations: z.array(z.string()).optional(),
    }).parse(req.body);

    const [updated] = await db
      .update(medicalVerificationTable)
      .set({
        ...body,
        verifiedAt: body.verificationStatus === "verified" ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(medicalVerificationTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Verification not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete verification
router.delete("/medical-verification/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    await db
      .delete(medicalVerificationTable)
      .where(eq(medicalVerificationTable.id, id));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
