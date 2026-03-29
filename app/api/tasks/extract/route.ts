import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { P_TASK_CREATE } from "@/lib/rbac/permissions";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: NextRequest) {
  try {
    if (!genAI) {
      throw new ApiError(500, "GEMINI_API_KEY is not configured on the server.");
    }

    const { workspaceSlug, notes } = await req.json();

    if (!workspaceSlug) {
      throw new ApiError(400, "workspaceSlug is required");
    }
    if (!notes || notes.trim() === "") {
      throw new ApiError(400, "Notes text is required");
    }

    // Auth check - Must be allowed to create tasks
    await checkPermission(workspaceSlug, P_TASK_CREATE);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert project manager assistant.
Your job is to read the following meeting notes/transcript and extract exactly actionable tasks.

Output ONLY a raw JSON array of objects. 
Each object must have exactly two fields:
- "title": A short string (max 60 characters) representing the actionable task.
- "priority": A string that is exactly one of the following based on urgency: "LOW", "MEDIUM", "HIGH", "URGENT".

Do not wrap the JSON in markdown blocks (e.g. \`\`\`json). Just return the raw JSON array.
If no tasks can be extracted, return an empty array [].

NOTES TO EXTRACT:
"""
${notes}
"""
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown blocks just in case Gemini occasionally ignores instructions
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("\`\`\`json")) {
      cleanedText = cleanedText.substring(7);
    } else if (cleanedText.startsWith("\`\`\`")) {
      cleanedText = cleanedText.substring(3);
    }
    if (cleanedText.endsWith("\`\`\`")) {
      cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }
    cleanedText = cleanedText.trim();

    let tasks = [];
    try {
      tasks = JSON.parse(cleanedText);
    } catch (parseError) {
      throw new ApiError(500, "Failed to parse AI response into JSON. " + parseError);
    }

    if (!Array.isArray(tasks)) {
      throw new ApiError(500, "AI did not return an array.");
    }

    return NextResponse.json({ tasks });

  } catch (error) {
    return handleApiError(error);
  }
}
