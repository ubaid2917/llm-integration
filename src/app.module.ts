import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { AiModule } from './ai/ai.module';
import { Mem0Module } from './mem0/mem0.module';

@Module({
  imports: [AiModule, Mem0Module, ChatbotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
