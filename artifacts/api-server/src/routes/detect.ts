import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface DetectionResult {
  pothole: boolean;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number } | null;
  label: string;
}

router.post("/detect/frame", async (req, res) => {
  const { frame } = req.body as { frame?: string };

  if (!frame || typeof frame !== "string") {
    res.status(400).json({ error: "Missing base64 frame data" });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: frame.startsWith("data:") ? frame : `data:image/jpeg;base64,${frame}`,
                detail: "low",
              },
            },
            {
              type: "text",
              text: `You are a dashcam pothole detector analyzing a road surface frame from an Indian city.

Respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{"pothole":boolean,"confidence":number,"x":number,"y":number,"width":number,"height":number}

Rules:
- pothole: true only if you see a clear pothole, road crater, large crack, or severe road damage in the road surface
- confidence: 0.0 to 1.0 (how certain you are)
- x, y, width, height: bounding box as percentage (0-100) of the image dimensions where the pothole is. Use smaller boxes (width/height 10-25%). If no pothole, set all to 0.
- Do NOT trigger on normal road texture, shadows, lane markings, wet patches, or speed bumps
- Be conservative: only detect obvious potholes visible from a moving vehicle`,
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "";

    let parsed: any;
    try {
      const jsonMatch = text.match(/\{[^}]+\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      res.json({ pothole: false, confidence: 0, bbox: null, label: "No pothole" } as DetectionResult);
      return;
    }

    const result: DetectionResult = {
      pothole: Boolean(parsed.pothole),
      confidence: Math.min(1, Math.max(0, Number(parsed.confidence) || 0)),
      bbox: parsed.pothole && parsed.width > 0
        ? {
            x: Number(parsed.x) || 0,
            y: Number(parsed.y) || 0,
            width: Math.min(30, Number(parsed.width) || 15),
            height: Math.min(25, Number(parsed.height) || 12),
          }
        : null,
      label: parsed.pothole ? `Pothole ${Math.round((parsed.confidence ?? 0.85) * 100)}%` : "No pothole",
    };

    res.json(result);
  } catch (err: any) {
    console.error("Detection error:", err?.message);
    res.status(500).json({ error: "Detection failed", detail: err?.message });
  }
});

export default router;
