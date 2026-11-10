# LLM Integration

NestJS backend for building GenAI applications with Groq and Mem0.

## Requirements

- Node.js 20 or newer
- npm

## Getting Started

```powershell
npm install
Copy-Item .env.example .env
npm run start:dev
```

Set `GROQ_API_KEY`, `GROQ_MODEL`, and `MEM0_API_KEY` in `.env`.

## Reusable AI and memory services

`AiService` and `Mem0Service` are provided through global NestJS modules. Inject
them into feature services rather than creating API clients in each file.
`Mem0Service` provides user-scoped memory search and conversation storage.

The chat endpoint is `POST /api/chatbot/chat` and expects a stable user ID:

```json
{
  "userId": "user-123",
  "message": "What kind of food do I like?"
}
```

It searches that user's relevant memories, includes them when generating a
reply, then stores the user message and assistant reply in Mem0. In an
authenticated application, derive `userId` from the authenticated identity
rather than trusting an arbitrary ID supplied by the client.

The assistant can also call `search_memory` to look up relevant user memories
and `add_memory` to save a fact or preference provided by the user.