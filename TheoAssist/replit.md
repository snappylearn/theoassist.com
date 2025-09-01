# TheoAssist - Biblical Document Management & AI Theology Assistant

## Overview
TheoAssist is a full-stack biblical document management application with an AI-powered theology assistant. It allows users to create biblical collections, upload theological documents, and engage in spiritual conversations with an AI assistant specialized in Christian faith, scripture study, and spiritual growth. The application supports both independent theological conversations and collection-based conversations that leverage biblical document context, providing source attribution for AI responses.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables
- **Build Tool**: Vite
- **UI/UX Decisions**: Responsive design with a mobile-first approach, unified sidebar layouts across pages, and consistent TheoAssist branding with a biblical focus. The UI includes a dashboard, a clean chat interface with source attribution, and a drag-and-drop file upload interface.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (Neon serverless PostgreSQL)
- **AI Integration**: OpenAI GPT-4o for intelligent responses and theological conversation generation.
- **File Handling**: Multer for in-memory file uploads with content extraction for AI analysis.
- **Session Management**: PostgreSQL-based sessions.

### Database Schema
- **Users**: Authentication and profiles.
- **Projects**: Primary document organization with attachments and instructions.
- **Project Attachments**: Files uploaded to projects.
- **Conversations**: Chat sessions (independent or project-based).
- **Messages**: Individual chat messages with optional source references and artifact metadata.
- **Artifacts**: Interactive biblical tools and educational content.

### Key Features
- **Biblical Document Management**: Supports theological texts, sermons, PDFs, markdown, and CSV uploads with content extraction and storage. Projects are the primary organizational method, enabling project-specific conversations.
- **AI Theology Assistant**: Offers independent theological chat and project-contextualized conversations, providing source attribution. Persistent chat history is maintained.
- **Artifacts**: Generation and management of interactive biblical tools (e.g., Bible Quiz, Verse Memorizer, Prayer Journal, Scripture Search, Devotional Planner, Bible Timeline, Sermon Notes, Faith Tracker, Biblical Crossword, Psalm Generator, Bible Study Guide, Scripture Art).

### Data Flow
- **Document Upload**: Client-side validation, multipart form data upload to backend, content processing and storage, database metadata update, and cache invalidation.
- **Chat Flow**: User message submission, conversation type determination, document retrieval for contextual chats, OpenAI API call with context, AI response generation with source attribution, message/response storage, and client interface update.
- **Project Management**: User-created projects with instructions and attachments; project-based conversations leverage all attachments in context.

## External Dependencies

### Core Dependencies
- **OpenAI**: GPT-4o model.
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: Type-safe database operations.
- **TanStack Query**: Server state management and caching.
- **Radix UI**: Accessible component primitives.

### Development Tools (Integrated)
- **Vite**: Build tool.
- **TypeScript**: Type safety.
- **Tailwind CSS**: Styling framework.
- **ESBuild**: JavaScript bundling.