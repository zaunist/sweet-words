import { ChatConfig, ChatInput } from "../types";

export class GeminiService {
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor(config: ChatConfig) {
    this.baseUrl = config.provider === 'custom'
      ? config.baseUrl || ""
      : import.meta.env.VITE_GOOGLE_BASE_URL;
    this.apiKey = config.provider === 'google' && !config.apiKey
      ? import.meta.env.VITE_GOOGLE_API_KEY
      : config.apiKey;
    this.model = config.model || "gemini-1.5-pro";
  }

  async generateLoveMessage(input: ChatInput) {
    try {
      const { keywords, style, scene, name, minLength, maxLength, language } = input;
      
      const prompt = language === "zh" 
        ? `请以"${style}"的风格，在"${scene}"的场景下${
            keywords.length > 0 ? `，围绕"${keywords.join('、')}"的意境，` : ''
          }为${name}创作一段情话。要求：
1. 必须在情话中自然地提到"${name}"至少一次；
2. 内容要贴合${scene}场景的具体需求；
3. 富有创意和感染力；
4. 避免陈词滥调；
5. 字数必须在${minLength}到${maxLength}字之间；
6. 注重语言的韵律感，可以采用对偶、押韵等修辞手法；
7. 确保句子完整，不要断句。`
        : `Create a love message for ${name} in the "${style}" style, for the "${scene}" scene${
            keywords.length > 0 ? `, inspired by these keywords: ${keywords.join(', ')}` : ''
          }. Requirements:
1. Naturally include "${name}" at least once;
2. Make it relevant to the ${scene} scene;
3. Be creative and touching;
4. Avoid clichés;
5. The message must be between ${minLength} and ${maxLength} words;
6. Focus on rhythm and musicality, using techniques like parallelism and rhyme;
7. Ensure the message is complete and not cut off.`;

      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: maxLength * 2,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.candidates[0].content.parts[0].text,
      };
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return {
        error: "Failed to generate message. Please try again.",
      };
    }
  }
} 