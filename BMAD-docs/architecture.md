# Adify Architecture Document

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│                  (React + TypeScript)                    │
├─────────────────────────────────────────────────────────┤
│                    State Management                      │
│              (React Hooks + History Pattern)             │
├─────────────────────────────────────────────────────────┤
│                    Service Layer                         │
│                  (geminiService.ts)                      │
├─────────────────────────────────────────────────────────┤
│                    AI Integration                        │
│              (Google Gemini Pro Vision)                  │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Core Components

```
src/
├── App.tsx                 # Main orchestrator
├── components/
│   ├── Sidebar.tsx        # Format selection & image library
│   ├── Workspace.tsx      # Content display & editing
│   └── Icons.tsx          # Custom icon components
├── services/
│   └── geminiService.ts   # AI service layer
├── constants.ts           # Configuration & prompts
└── types.ts              # TypeScript definitions
```

## State Management Design

### History System
```typescript
interface HistoryEntry {
  state: AppState;
  timestamp: number;
}

// Enables undo/redo functionality
const [history, setHistory] = useState<HistoryEntry[]>([]);
const [historyIndex, setHistoryIndex] = useState(0);
```

### Session Gallery
```typescript
interface GalleryItem {
  id: string;
  type: 'mockup' | 'social' | 'facebook';
  content: GeneratedContent;
  timestamp: number;
}

// Stores up to 16 recent generations
const [sessionGallery, setSessionGallery] = useState<GalleryItem[]>([]);
```

## AI Integration Architecture

### Service Layer Pattern
All AI operations are centralized in `geminiService.ts`:

```typescript
class GeminiService {
  private model: GenerativeModel | null = null;
  
  async initialize(apiKey: string): Promise<void>
  async generateImageDescription(imageBase64: string): Promise<string>
  async generateAdMockup(params: AdParams): Promise<string>
  async generateFacebookAdContent(params: FbParams): Promise<FbContent>
  async editImage(params: EditParams): Promise<string>
  async generateSlogan(params: SloganParams): Promise<string>
}
```

### Prompt Engineering Strategy

1. **Structured Prompts**: Each generation type has specific prompt templates
2. **Design Rules Enforcement**: Rules embedded in every image generation prompt
3. **Context Preservation**: Image descriptions carried through generation pipeline
4. **Safety Filters**: Handling for blocked content gracefully

## Data Flow Architecture

### Generation Pipeline
```
User Upload → Base64 Conversion → AI Description → Format Selection → 
AI Generation → Result Display → Session Storage → History Update
```

### Edit Pipeline
```
Current Content → Edit Prompt → AI Modification → 
Result Validation → Display Update → History Entry
```

## Error Handling Architecture

### Layered Error Handling
1. **API Level**: Network failures, rate limits
2. **Service Level**: AI errors, safety blocks
3. **Component Level**: UI errors, validation
4. **User Level**: Friendly messages, recovery options

### Error Recovery Strategy
```typescript
try {
  // Primary operation
} catch (error) {
  if (error.message.includes('SAFETY')) {
    // Handle safety filter
  } else if (error.message.includes('API_KEY')) {
    // Handle API key issues
  } else {
    // Generic error handling
  }
}
```

## Performance Optimization

### Current Optimizations
1. **Singleton AI Model**: Reuse initialized model
2. **Base64 Caching**: Store converted images
3. **Lazy Loading**: Components load on demand
4. **Debounced Inputs**: Prevent excessive API calls

### Future Optimizations
1. **Response Caching**: Cache similar requests
2. **Progressive Loading**: Stream AI responses
3. **Worker Threads**: Offload heavy processing
4. **CDN Integration**: Serve static assets

## Security Architecture

### Current Security Measures
1. **Environment Variables**: API keys never in code
2. **Input Validation**: All user inputs sanitized
3. **Content Filtering**: AI safety filters active
4. **CORS Headers**: Proper origin validation

### Planned Security Enhancements
1. **Backend Proxy**: Hide API keys completely
2. **Rate Limiting**: Per-user request limits
3. **Authentication**: User accounts and sessions
4. **Encryption**: End-to-end for sensitive data

## Deployment Architecture

### Current (Frontend Only)
```
GitHub Repo → Vercel → CDN → Users
     ↓
Environment Variables (API Keys)
```

### Future (Full Stack)
```
Frontend (Vercel) ← → Backend (Encore) ← → Gemini API
                           ↓
                      Database
                      User Auth
                      Analytics
```

## Scalability Considerations

### Horizontal Scaling
- Stateless frontend can scale infinitely
- CDN distribution for global performance
- Load balancing for API requests

### Vertical Scaling
- Upgrade Gemini API tier for more requests
- Increase timeout limits for complex generations
- Enhanced caching for frequent operations

## Monitoring & Observability

### Current Monitoring
- Console logging for debugging
- Error boundaries for crash prevention
- Loading states for user feedback

### Planned Monitoring
- Error tracking (Sentry)
- Performance monitoring (Lighthouse)
- User analytics (Mixpanel)
- API usage tracking

## Testing Architecture

### Unit Testing Strategy
- Service layer functions
- Utility functions
- Component logic

### Integration Testing
- AI service integration
- Component interactions
- State management

### E2E Testing
- User workflows
- Generation pipeline
- Error scenarios

## Database Architecture (Future)

### Planned Schema
```sql
-- Users table
users (id, email, created_at)

-- Generations table  
generations (id, user_id, type, prompt, result, created_at)

-- Templates table
templates (id, user_id, name, config, created_at)

-- Analytics table
analytics (id, user_id, action, metadata, created_at)
```

## API Architecture (Future)

### RESTful Endpoints
```
POST /api/generate/mockup
POST /api/generate/social
POST /api/generate/facebook
POST /api/edit
GET  /api/gallery
GET  /api/history
```

### GraphQL Alternative
```graphql
type Mutation {
  generateMockup(input: MockupInput!): MockupResult!
  generateSocial(input: SocialInput!): SocialResult!
  editContent(input: EditInput!): EditResult!
}
```

## Technology Decisions

### Why Gemini AI?
- Superior image understanding
- Flexible prompt handling
- Cost-effective pricing
- Fast response times

### Why React + TypeScript?
- Type safety
- Component reusability
- Large ecosystem
- Developer experience

### Why Vite?
- Fast development
- Modern tooling
- Optimal bundling
- Easy configuration

### Why Tailwind CSS?
- Rapid styling
- Consistent design
- Small bundle size
- Responsive by default