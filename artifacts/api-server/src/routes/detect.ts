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
  rawResponse?: string;
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
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: frame.startsWith("data:") ? frame : `data:image/jpeg;base64,${frame}`,
                detail: "high",
              },
            },
            {
              type: "text",
              text: `You are a road hazard detector for a dashcam safety system. Analyze this dashcam frame for potholes or road damage.

A pothole can appear as:
- Dark circular/oval depressions in the road surface
- Craters filled with water (appearing as dark puddles with irregular edges)
- Snow/ice-covered depressions with irregular shapes
- Cracked or broken asphalt patches
- Raised edges or lips around a road depression

Respond ONLY with valid JSON (no markdown, no explanation):
{"pothole":boolean,"confidence":number,"x":number,"y":number,"width":number,"height":number,"note":string}

Fields:
- pothole: true if you see ANY pothole, road crater, or significant road surface damage
- confidence: 0.0 to 1.0
- x, y: top-left corner of bounding box as % of image (0-100)
- width, height: bounding box size as % of image (keep between 8-25%)
- note: one sentence describing what you see on the road surface
- If multiple potholes, return the largest/most prominent one
- If no pothole: set pothole=false, confidence=0, x=0,y=0,width=0,height=0`,
            },
          ],
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "";
    console.log(`[detect] model response: ${text}`);

    let parsed: any;
    try {
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      console.error(`[detect] JSON parse failed: ${text}`);
      res.json({ pothole: false, confidence: 0, bbox: null, label: "Parse error", rawResponse: text } as DetectionResult);
      return;
    }

    const result: DetectionResult = {
      pothole: Boolean(parsed.pothole),
      confidence: Math.min(1, Math.max(0, Number(parsed.confidence) || 0)),
      bbox: parsed.pothole && Number(parsed.width) > 0
        ? {
            x: Math.max(0, Math.min(85, Number(parsed.x) || 10)),
            y: Math.max(0, Math.min(80, Number(parsed.y) || 40)),
            width: Math.min(30, Math.max(8, Number(parsed.width) || 15)),
            height: Math.min(25, Math.max(6, Number(parsed.height) || 10)),
          }
        : null,
      label: parsed.pothole
        ? `Pothole ${Math.round((Number(parsed.confidence) || 0.8) * 100)}%`
        : "No pothole",
      rawResponse: parsed.note ?? text,
    };

    console.log(`[detect] result: pothole=${result.pothole}, conf=${result.confidence}, note=${result.rawResponse}`);
    res.json(result);
  } catch (err: any) {
    console.error("Detection error:", err?.message);
    res.status(500).json({ error: "Detection failed", detail: err?.message });
  }
});

export default router;
