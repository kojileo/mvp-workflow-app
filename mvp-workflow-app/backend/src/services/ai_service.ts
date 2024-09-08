import { generateText } from "../utils/gemini_client";

export class AIService {
  static async summarizeText(text: string, maxLength: number): Promise<string> {
    const prompt = `Summarize the following text in ${maxLength} characters or less:\n\n${text}`;
    return generateText(prompt);
  }

  // 他のAI機能も同様に実装できます
}
