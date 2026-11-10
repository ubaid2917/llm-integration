import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { AiModule } from '../ai/ai.module';
import { OpenAiTools } from './open_ai_tools';

@Module({
  imports: [AiModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, OpenAiTools],
})
export class ChatbotModule {}
