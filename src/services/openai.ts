import axios from 'axios';
import { ChatConfig, ChatInput, ChatResponse } from '../types';

export class OpenAIService {
  private config: ChatConfig;

  constructor(config: ChatConfig) {
    this.config = {
      ...config,
      baseUrl: config.provider === 'custom' 
        ? config.baseUrl 
        : import.meta.env.VITE_OPENAI_BASE_URL
    };
  }

  async generateLoveMessage(input: ChatInput): Promise<ChatResponse> {
    try {
      const systemPrompts = {
        zh: `你是一个情话生成器。请根据给定的场景、关键词意境和风格创作情话。关键词用于启发和联想，不必直接出现在情话中。但必须在情话中自然地使用收信人的名字（至少使用一次），让收信人明确感受到这段话是写给Ta的。字数要求在${this.config.minLength}到${this.config.maxLength}字之间。注重语言的韵律感，可以采用对偶、押韵等修辞手法。请确保生成完整的句子，不要断句。`,
        en: `You are a love message generator. Create a message based on the given scene, keywords' context, and style. Keywords are for inspiration and don't need to appear directly. However, you must naturally include the recipient's name at least once to make it personal. The message should be between ${this.config.minLength} and ${this.config.maxLength} characters. Focus on rhythm and musicality, using techniques like parallelism and rhyme. Ensure the message is complete and not cut off.`
      };

      const userPrompts = {
        zh: `请以"${input.style}"的风格，在"${input.scene}"的场景下${
          input.keywords.length > 0 ? `，围绕"${input.keywords.join('、')}"的意境，` : ''
        }为${input.name}创作一段情话。要求：
1. 必须在情话中自然地提到"${input.name}"至少一次；
2. 内容要贴合${input.scene}场景的具体需求；
3. 富有创意和感染力；
4. 避免陈词滥调；
5. 字数必须在${input.minLength}到${input.maxLength}字之间；
6. 注重语言的韵律感，可以采用对偶、押韵等修辞手法；
7. 确保句子完整，不要断句。`,
        en: `Create a love message for ${input.name} in the "${input.style}" style, for the "${input.scene}" scene${
          input.keywords.length > 0 ? `, inspired by these keywords: ${input.keywords.join(', ')}` : ''
        }. Requirements:
1. Naturally include "${input.name}" at least once;
2. Make it relevant to the ${input.scene} scene;
3. Be creative and touching;
4. Avoid clichés;
5. The message must be between ${input.minLength} and ${input.maxLength} words;
6. Focus on rhythm and musicality, using techniques like parallelism and rhyme;
7. Ensure the message is complete and not cut off.`
      };

      const response = await axios.post(
        `${this.config.baseUrl}/v1/chat/completions`,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompts[input.language]
            },
            {
              role: "user",
              content: userPrompts[input.language]
            }
          ],
          temperature: 0.7,
          max_tokens: Math.floor((this.config.maxLength || 150) * 2),
          stop: null
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        content: response.data.choices[0].message.content.trim()
      };
    } catch (error) {
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Failed to generate message'
      };
    }
  }
} 