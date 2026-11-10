import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Mem0Service } from '../mem0/mem0.service';

@Injectable()
export class OpenAiTools {
  readonly definitions: OpenAI.ChatCompletionTool[] = [
    {
      type: 'function',
      function: {
        name: 'search_memory',
        description: 'Search the current user’s saved memories for relevant information.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'What to look for in the user’s memories.',
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'add_memory',
        description: 'Save a useful fact or preference to the current user’s memory.',
        parameters: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The fact or preference to remember.',
            },
          },
          required: ['content'],
          additionalProperties: false,
        },
      },
    },
  ];

  constructor(private readonly mem0Service: Mem0Service) {}

  async execute(
    name: string,
    argumentsJson: string,
    userId: string,
  ): Promise<unknown> {
    const args: unknown = JSON.parse(argumentsJson);
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
      throw new Error(`Invalid arguments for tool "${name}"`);
    }

    const input = args as Record<string, unknown>;

    switch (name) {
      case 'search_memory':
        return this.mem0Service.searchMemories(
          userId,
          this.getRequiredString(input, 'query', name),
        );
      case 'add_memory':
        await this.mem0Service.addMemory(
          userId,
          this.getRequiredString(input, 'content', name),
        );
        return { success: true };
      default:
        throw new Error(`Unknown tool "${name}"`);
    }
  }

  private getRequiredString(
    input: Record<string, unknown>,
    key: string,
    toolName: string,
  ): string {
    const value = input[key];
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Tool "${toolName}" requires a non-empty "${key}" string`);
    }
    return value.trim();
  }
}