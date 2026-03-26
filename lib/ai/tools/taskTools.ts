import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type ProposedTask = {
  title: string;
  assignee?: string;
  due?: string;
};

/**
 * Uses Gemini to parse meeting notes into structured task objects.
 */
export async function parseTasksFromNotes(
  notes: string
): Promise<ProposedTask[]> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          tasks: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                assignee: { type: SchemaType.STRING },
                due: { type: SchemaType.STRING },
              },
              required: ["title"],
            },
          },
        },
        required: ["tasks"],
      },
    },
  });

  const prompt = `Extract a list of actionable tasks from these meeting notes. 
For each task include: a clear title, who it is assigned to (if mentioned), and when it is due (if mentioned, use relative terms like "Tomorrow", "Friday", "Next week").
Return only tasks that are explicit action items.

Meeting notes:
${notes}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text) as { tasks: ProposedTask[] };
  return parsed.tasks ?? [];
}
