import axios from 'axios';
import { ChatConfig, ChatInput, ChatResponse } from '../types';

export class OpenAIService {
  private config: ChatConfig;

  constructor(config: ChatConfig) {
    this.config = config;
  }

  async generateLoveMessage(input: ChatInput): Promise<ChatResponse> {
    try {
      const systemPrompts = {
        zh: `你是一个浪漫的情话生成器。请创作优美、富有韵律感的情话，要求：
1. 字数要求在${this.config.minLength}到${this.config.maxLength}字之间
2. 要巧妙地将收信人的名字融入情话中，使其成为情话的一部分，而不是生硬地添加
3. 注意语言的节奏感和音韵美，可以适当使用对偶、押韵等修辞手法
4. 确保生成的是完整的句子，不要断句`,
        en: `You are a romantic message generator. Create beautiful and rhythmic love messages with these requirements:
1. The message should be between ${this.config.minLength} and ${this.config.maxLength} characters
2. Creatively incorporate the recipient's name into the message, making it an integral part of the expression
3. Pay attention to rhythm and phonetic beauty, using techniques like parallelism and rhyme where appropriate
4. Ensure the message is complete and not cut off`
      };

      const userPrompts = {
        zh: `请以"${input.style}"的风格，在"${input.scene}"的场景下${
          input.keywords.length > 0 ? `，围绕"${input.keywords.join('、')}"的意境，` : ''
        }为${input.name}创作一段情话。要求：
1. 将"${input.name}"的名字巧妙地融入情话中，使其成为情话的一部分
2. 内容要贴合${input.scene}场景的具体需求
3. 注重语言的韵律感，可以采用对偶、押韵等手法
4. 富有创意和感染力
5. 避免陈词滥调
6. 确保句子完整，不要断句`,
        en: `Create a love message for ${input.name} in the "${input.style}" style, for the "${input.scene}" scene${
          input.keywords.length > 0 ? `, inspired by these keywords: ${input.keywords.join(', ')}` : ''
        }. Requirements:
1. Creatively weave "${input.name}" into the message as an integral part
2. Make it relevant to the ${input.scene} scene
3. Focus on rhythm and musicality, using techniques like parallelism and rhyme
4. Be creative and touching
5. Avoid clichés
6. Ensure the message is complete and not cut off`
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
          max_tokens: Math.floor(this.config.maxLength * 2),
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