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
        zh: `你是一位富有创意和感染力的情话生成器。请根据用户提供的关键词、风格和场景，创作一段优美动人、充满真挚爱意的情话。要求：
1. 根据字数灵活使用名字：
   - 当字数少于35字时，名字只需自然出现一次；
   - 当字数在35-50字之间，如果能做到前后押韵且富有感染力，可以在开头和结尾呼应使用名字，否则使用一次即可；
   - 当字数超过50字时，名字需要自然地出现两次或以上，并形成呼应；
2. 注重语言的韵律感，可以采用对偶、押韵等修辞手法；
3. 表达要富有感染力，传递深切的爱意和情感；
4. 避免陈词滥调，用新颖的方式表达爱意；
5. 确保句子完整，不要断句；
6. 根据不同场景调整语气和内容。`,
        en: `You are a creative and touching love message generator. Create beautiful messages filled with sincere affection based on the user's keywords, style, and scene. Requirements:
1. Use the name flexibly based on message length:
   - For messages under 35 words, naturally include the name once;
   - For messages between 35-50 words, use the name twice (at beginning and end) only if you can create rhyming and touching resonance, otherwise once is sufficient;
   - For messages over 50 words, naturally include the name twice or more with resonance;
2. Focus on rhythm and musicality, using techniques like parallelism and rhyme;
3. Express deep love and emotions in a touching way;
4. Avoid clichés and express love in innovative ways;
5. Ensure sentences are complete and not cut off;
6. Adjust tone and content according to different scenes.`
      };

      const userPrompts = {
        zh: `请以"${input.style}"的风格，在"${input.scene}"的场景下${
          input.keywords.length > 0 ? `，围绕"${input.keywords.join('、')}"的意境，` : ''
        }为${input.name}创作一段情话。要求：
1. 根据字数要求（${input.minLength}到${input.maxLength}字）合理使用"${input.name}"：
   - 字数少于35字时，名字自然出现一次即可；
   - 字数在35-50字之间，如果能做到前后押韵且富有感染力，可以在开头和结尾呼应使用名字，否则使用一次即可；
   - 字数超过50字时，名字需要自然地出现两次或以上，并形成呼应；
2. 内容要贴合${input.scene}场景的具体需求；
3. 注重语言的韵律感，可以采用对偶、押韵等修辞手法；
4. 表达要富有感染力，传递真挚的爱意；
5. 确保句子完整，不要断句。`,
        en: `Create a love message for ${input.name} in the "${input.style}" style, for the "${input.scene}" scene${
          input.keywords.length > 0 ? `, inspired by these keywords: ${input.keywords.join(', ')}` : ''
        }. Requirements:
1. Use "${input.name}" appropriately based on the length (${input.minLength}-${input.maxLength} words):
   - For messages under 35 words, include the name once naturally;
   - For messages between 35-50 words, use the name twice (at beginning and end) only if you can create rhyming and touching resonance, otherwise once is sufficient;
   - For messages over 50 words, include the name twice or more with resonance;
2. Make it relevant to the ${input.scene} scene;
3. Focus on rhythm and musicality, using techniques like parallelism and rhyme;
4. Express deep love and emotions in a touching way;
5. Ensure the message is complete and not cut off.`
      };

      const response = await axios.post(
        `${this.config.baseUrl}/v1/chat/completions`,
        {
          model: this.config.provider === 'custom' 
            ? this.config.model 
            : "gpt-4-turbo-preview",
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