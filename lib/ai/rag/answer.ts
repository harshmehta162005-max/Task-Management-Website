import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt, type ChatMode } from "@/lib/ai/systemPrompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type HistoryMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

/**
 * Sends a message to Gemini with mode-appropriate system prompt
 * and optional workspace/project context.
 */
export async function askGemini(
  mode: ChatMode,
  contextData: string | null,
  history: HistoryMessage[],
  userMessage: string
): Promise<string> {
  const systemPrompt = getSystemPrompt(mode);

  // Build full system instruction
  let systemInstruction = systemPrompt;
  if (contextData) {
    systemInstruction += `\n\n---\n\nREAL-TIME DATA:\n${contextData}`;
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction,
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
