import { generateText } from "../utils/gemini_client";

export class AIService {
  static async summarizeText(text: string, maxLength: number): Promise<string> {
    const prompt = `以下のテキストを${maxLength}文字以内で要約してください。要約のみを提供し、追加のテキストや説明は含めないでください：\n\n${text}`;
    const result = await generateText(prompt);
    return result.trim().replace(/\n/g, "\n");
  }

  // 他のAI機能も同様に実装できます
}
