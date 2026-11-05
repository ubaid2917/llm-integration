import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AppService {
  private readonly client = process.env.OPENROUTER_API_KEY
    ? new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      })
    : null;

  private readonly model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  
  // summarize ticket 
  async summarizeTicket(ticket: string): Promise<any> {
    if (!this.client || !this.model) {
      throw new ServiceUnavailableException(
        'OPENROUTER_API_KEY and OPENROUTER_MODEL must be configured',
      );
    }

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'you are a helpful assistant that help customer support executive to summarize the customer query in one 2 lines ',
        },
        { role: 'user', content: ticket },
      ],
    }); 

   return response.choices[0]?.message.content ?? '';

  }
}