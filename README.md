# NestJS Sample Project

A small NestJS application scaffolded with TypeScript.

## Requirements

- Node.js 20 or newer
- npm

## Getting started

```bash
npm install
Copy-Item .env.example .env
npm run start:dev
```

`dotenv` loads `.env` when the app starts. Set `PORT` to change the server port,
put your Groq key in `GROQ_API_KEY`, and set `GROQ_MODEL` to the model ID from
your Groq API request (the example uses `openai/gpt-oss-120b`). Keep real
secrets in `.env`; it is excluded from Git.
Update `.env.example` when adding new required environment variables, but never
put real secrets in that file.

## Generate text with Groq

Send a prompt to `POST /generate` (the request uses Groq's OpenAI-compatible
Chat Completions API):

```powershell
Invoke-RestMethod -Uri http://localhost:3000/generate -Method Post `
  -ContentType "application/json" -Body '{"prompt":"Write a short greeting"}'
```

The response contains the generated text in its `text` property.

## Endpoints

- `GET /` returns a greeting.
- `GET /health` returns the application health status.

## Other commands

- `npm run build` compiles the application into `dist/`.
- `npm start` starts the app with the Nest CLI.
- `npm run start:prod` runs the compiled app from `dist/`.
