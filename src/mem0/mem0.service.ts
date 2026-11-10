import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Memory, MemoryClient } from 'mem0ai';

@Injectable()
export class Mem0Service {
  private readonly client = process.env.MEM0_API_KEY
    ? new MemoryClient({ apiKey: process.env.MEM0_API_KEY })
    : null;

  async searchMemories(userId: string, query: string): Promise<string[]> {
    const client = this.getClient();
    const { results } = await client.search(query, {
      filters: { user_id: userId },
      topK: 5,
    });

    return results
      .map((memory: Memory) => memory.memory ?? memory.data?.memory)
      .filter((memory): memory is string => Boolean(memory));
  }

  async saveConversation(
    userId: string,
    userMessage: string,
    assistantMessage: string,
  ): Promise<void> {
    await this.getClient().add(
      [
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage },
      ],
      { userId },
    );
  }

  async addMemory(userId: string, content: string): Promise<void> {
    await this.getClient().add([{ role: 'user', content }], { userId });
  }

  private getClient(): MemoryClient {
    if (!this.client) {
      throw new ServiceUnavailableException('MEM0_API_KEY is not configured');
    }

    return this.client;
  }
}
