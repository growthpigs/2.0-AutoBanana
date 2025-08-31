# CLAUDE.md - BMAD-Enhanced Configuration

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
This project uses the BMAD (Build-Model-Adapt-Document) methodology with integrated MCPs for quality assurance.

## Project Overview

Adify is an AI-powered ad generation tool that transforms product images into professional marketing materials using Google's Gemini AI. The application generates ad mockups, social media posts, and Facebook ad content with both visual and text components.

## Active MCPs (Model Context Protocols)

### CodeRabbit MCP
- **Status**: ✅ Active
- **Config**: `.claude/mcps/coderabbit-config.json`
- **Purpose**: AI code review on every commit

### Sourcegraph AMP (formerly Cody)
- **Status**: ✅ Active  
- **Config**: `.claude/mcps/sourcegraph-amp-config.json`
- **Purpose**: Code intelligence and refactoring

### TestSprite MCP
- **Status**: ✅ Active
- **Config**: `test-docs/testsprite-config.json`
- **Purpose**: AI test generation (80% coverage target)

## Git Workflow (Graphite)

We use Graphite for stacked PRs:
```bash
gt status          # Check status
gt commit -m ""    # Commit
gt submit         # Submit for review
gt stack update   # Sync with main
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Testing with TestSprite
npm test
npm run test:coverage
npm run test:e2e

# Code quality
npm run lint
npm run typecheck
```

## Environment Setup

Create a `.env.local` file with your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

The API key is accessed via `process.env.API_KEY` in the code (configured through Vite).

## Architecture & Key Components

### State Management Flow
The application uses React's built-in state management with a centralized approach in `App.tsx`:
- **History System**: Maintains an array of generated content states with undo/redo capability
- **Session Gallery**: Stores up to 16 recent generations for quick access
- **Loading States**: Granular loading indicators (`idle`, `describing`, `generating_text`, `generating_image`, `editing`)

### AI Service Layer (`services/geminiService.ts`)
All Gemini AI interactions are centralized here:
- **Image Description**: Analyzes uploaded images to generate contextual descriptions
- **Ad Generation**: Creates mockups by combining product images with prompts and slogans
- **Content Generation**: Produces Facebook ad copy (headline, body, image prompt)
- **Image Editing**: Modifies generated images based on text prompts
- **Slogan Generation**: Creates various text styles (hook, meme, joke, quote, tagline)

### Content Types & Formats
Three main format categories defined in `constants.ts`:
1. **Mockups** (`AD_FORMATS`): Physical/digital placement mockups (billboards, products, etc.)
2. **Social Media** (`SOCIAL_MEDIA_FORMATS`): Platform-specific formats with meme templates
3. **Facebook Ads** (`FACEBOOK_AD_FORMATS`): Direct-response copywriting frameworks

### Component Architecture
- **App.tsx**: Main orchestrator handling all state and business logic
- **Sidebar**: Format selection and image library management
- **Workspace**: Display area for generated content with editing tools
- **Service Layer**: All AI operations isolated in `geminiService.ts`

### Design Rules System
The application enforces strict design rules (defined in `constants.ts`) for all generated content:
- Image containment (no edge-to-edge placement)
- Text placement outside product areas
- Font standardization
- High-fidelity rendering requirements

### Error Handling
Comprehensive error handling throughout:
- API key validation
- Image generation failures with specific reasons
- Safety filter responses
- Network failures with user-friendly messages

## Key Technical Decisions

1. **Single AI Instance**: The app maintains a singleton Gemini AI instance to avoid re-initialization
2. **Base64 Image Handling**: All images are converted to base64 for AI processing and display
3. **History Pattern**: Every generation creates a new history entry, enabling undo/redo
4. **Prompt Engineering**: Design rules are embedded in prompts to ensure consistent output quality
5. **Type Safety**: Full TypeScript coverage with discriminated unions for content types

## Testing Approach

While no formal test suite exists, the app includes:
- Default product image for immediate testing without uploads
- Error boundaries and comprehensive error messages
- Loading state management for all async operations

## Common Development Tasks

### Adding New Ad Formats
1. Add format definition to appropriate array in `constants.ts`
2. Import/create icon in `components/Icons.tsx`
3. Format will automatically appear in UI

### Modifying AI Behavior
All AI prompts and interactions are in `services/geminiService.ts`. Key functions:
- `generateAdMockup()`: Main image generation
- `generateFacebookAdContent()`: Facebook-specific content
- `editImage()`: Image modifications
- `generateSlogan()`: Text generation

### Updating Design Rules
Modify the `DESIGN_RULES` constant in `constants.ts` to change global image generation constraints.