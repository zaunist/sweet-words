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
1. 根据字数要求（${minLength}到${maxLength}字）合理使用"${name}"：
   - 字数少于35字时，名字自然出现一次即可；
   - 字数在35-50字之间，如果能做到前后押韵且富有感染力，可以在开头和结尾呼应使用名字，否则使用一次即可；
   - 字数超过50字时，名字需要自然地出现两次或以上，并形成呼应；
2. 内容要贴合${scene}场景的具体需求；
3. 注重语言的韵律感，可以采用对偶、押韵等修辞手法；
4. 表达要富有感染力，传递真挚的爱意；
5. 避免陈词滥调，用新颖的方式表达情感；
6. 确保句子完整，不要断句。`
        : `Create a love message for ${name} in the "${style}" style, for the "${scene}" scene${
            keywords.length > 0 ? `, inspired by these keywords: ${keywords.join(', ')}` : ''
          }. Requirements:
1. Use "${name}" appropriately based on the length (${minLength}-${maxLength} words):
   - For messages under 35 words, include the name once naturally;
   - For messages between 35-50 words, use the name twice (at beginning and end) only if you can create rhyming and touching resonance, otherwise once is sufficient;
   - For messages over 50 words, include the name twice or more with resonance;
2. Make it relevant to the ${scene} scene;
3. Focus on rhythm and musicality, using techniques like parallelism and rhyme;
4. Express deep love and emotions in a touching way;
5. Avoid clichés and express feelings in innovative ways;
6. Ensure the message is complete and not cut off.`;

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