# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in natural language via a chat interface, and the AI generates React code that renders in a sandboxed iframe preview. All files exist in a virtual file system (no disk I/O).

## Commands

```bash
npm run setup        # Install deps + generate Prisma client + run migrations
npm run dev          # Start dev server (Next.js + Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (watch mode)
npx vitest run       # Run tests once
npm run db:reset     # Reset SQLite database
```

All `dev`/`build`/`start` scripts require `NODE_OPTIONS='--require ./node-compat.cjs'` (already configured in package.json).

## Architecture

### Core Data Flow

1. User sends message via chat → `ChatProvider` (uses Vercel AI SDK `useChat()`) → `POST /api/chat`
2. Server reconstructs `VirtualFileSystem` from serialized file data sent in request body
3. `streamText()` streams AI response with tool calls (`str_replace_editor`, `file_manager`)
4. Tool calls execute against the server-side VFS; client-side `FileSystemContext.handleToolCall()` mirrors changes
5. `PreviewFrame` builds an import map from all VFS files via `jsx-transformer.ts`, creating blob URLs for each transformed file, and renders in a sandboxed iframe

### Key Abstractions

- **VirtualFileSystem** (`src/lib/file-system.ts`): In-memory file tree with serialize/deserialize. Both server (in route handler) and client (in context) maintain instances. The AI operates on the server copy; tool call results sync to client.
- **JSX Transformer** (`src/lib/transform/jsx-transformer.ts`): Uses `@babel/standalone` to transform JSX/TSX to ES modules, creates blob URLs, builds import maps with `@/` alias resolution. Third-party imports resolve via `esm.sh`.
- **Mock Provider** (`src/lib/provider.ts`): When `ANTHROPIC_API_KEY` is unset, a `MockLanguageModel` implementing `LanguageModelV1` returns static component code. Used for development without API costs.

### AI Tool System

The AI has two tools defined in `src/lib/tools/`:
- `str_replace_editor`: create, view, str_replace, insert, undo_edit commands on virtual files
- `file_manager`: rename, delete commands

The system prompt (`src/lib/prompts/generation.tsx`) requires `/App.jsx` as the root entrypoint and `@/` import aliases for local files.

### State Management

Two React contexts drive the app:
- `ChatProvider` (`src/lib/contexts/chat-context.tsx`): Wraps Vercel AI SDK's `useChat`, sends serialized VFS with each request
- `FileSystemProvider` (`src/lib/contexts/file-system-context.tsx`): Manages VFS instance, handles tool call execution client-side, tracks selected file

### Layout

`MainContent` (`src/app/main-content.tsx`) renders a resizable 3-panel layout: chat (left), preview/code (right, tabbed). Code view has a file tree + Monaco editor.

### Auth & Persistence

- JWT-based auth with HTTP-only cookies (`jose` library, not next-auth)
- Server actions in `src/actions/` for sign-up/sign-in/project CRUD
- Prisma + SQLite; messages and VFS data stored as JSON strings in the Project model
- Anonymous usage supported (projects saved only for authenticated users)
- The database schema is defined in `prisma/schema.prisma` — always reference it to understand stored data structure

## Conventions

- **Path alias**: `@/*` maps to `src/*`
- **UI components**: shadcn/ui (new-york style) in `src/components/ui/`, Radix primitives underneath
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss` plugin
- **Client components**: Explicitly marked with `"use client"`
- **Tests**: Colocated in `__tests__/` directories next to components, using Vitest + Testing Library + jsdom
- **Prisma client output**: Generated to `src/generated/prisma` (not default node_modules location)
