import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import OpenAI from 'openai';

const MAX_TOOL_ROUNDS = 5;

@Injectable()
export class AiService {
  private readonly client = process.env.GROQ_API_KEY
    ? new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      })
    : null;

  private readonly model = process.env.GROQ_MODEL;

  async generateText(
    prompt: string,
    systemPrompt?: string,
    tools?: OpenAI.ChatCompletionTool[],
    executeTool?: (name: string, argumentsJson: string) => Promise<unknown>,
  ): Promise<string> {
    if (!this.client || !this.model) {
      throw new ServiceUnavailableException(
        'GROQ_API_KEY and GROQ_MODEL must be configured',
      );
    }

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user', content: prompt },
    ];

    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        ...(tools?.length ? { tools, tool_choice: 'auto' as const } : {}),
      });
      const assistantMessage = response.choices[0]?.message;

      if (!assistantMessage) {
        return '';
      }

      if (!assistantMessage.tool_calls?.length) {
        return assistantMessage.content ?? '';
      }

      if (!tools?.length || !executeTool) {
        throw new InternalServerErrorException(
          'The model requested a tool, but no tool executor is configured',
        );
      }

      messages.push(assistantMessage);
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type !== 'function') {
          continue;
        }

        const result = await executeTool(
          toolCall.function.name,
          toolCall.function.arguments,
        );
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    throw new InternalServerErrorException(
      'The model exceeded the maximum number of tool-call rounds',
    );
  }
}
