# System Architecture - Mini Google AI

## Overview
A scalable, microservices-based search engine with AI reasoning capabilities.

## Architecture Diagram
```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────┐
│         Frontend (React + Vite)              │
│  - Search UI                                 │
│  - Knowledge Graph Visualization (D3.js)     │
│  - Voice Search (Web Speech API)             │
│  - Real-time Updates (WebSocket)             │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│         API Gateway / Load Balancer          │
│              (Nginx)                         │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│         Microservices Layer                  │
├──────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐     │
│  │ Search Service │  │  AI Service    │     │
│  │ (Elasticsearch)│  │  (Gemini API)  │     │
│  └────────────────┘  └────────────────┘     │
│                                              │
│  ┌────────────────┐  ┌────────────────┐     │
│  │ Knowledge Graph│  │ User Preference│     │
│  │   (Neo4j)      │  │    Engine      │     │
│  └────────────────┘  └────────────────┘     │
└──────┬──────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────┐
│         Data Layer                           │
├──────────────────────────────────────────────┤
│  PostgreSQL  │  Neo4j  │  Elasticsearch     │
│  Redis Cache │  Pub/Sub Queue               │
└──────────────────────────────────────────────┘
```

## Component Details

### Frontend Layer
- **Framework**: React 18 + TypeScript + Vite
- **State Management**: Zustand + React Query
- **UI Components**: TailwindCSS + Framer Motion
- **Visualization**: D3.js (graphs), Recharts (trends)
- **Features**:
  - Google-like minimal search interface
  - Real-time voice search
  - Interactive knowledge graph
  - AI chat panel
  - Dark/Light mode

### Backend Services

#### 1. Search Service
- **Purpose**: Web crawling, indexing, and search
- **Tech**: Node.js + Elasticsearch
- **Features**:
  - Full-text search
  - Ranking algorithms
  - Query optimization
  - Result caching (Redis)

#### 2. Knowledge Graph Service
- **Purpose**: Entity relationships and graph queries
- **Tech**: Neo4j Graph Database
- **Features**:
  - Entity extraction
  - Relationship mapping
  - Graph traversal
  - Semantic connections

#### 3. AI Service
- **Purpose**: Intelligent summarization and reasoning
- **Tech**: Google Gemini API
- **Features**:
  - Query understanding
  - Content summarization
  - Trend prediction
  - Semantic search

#### 4. User Preference Engine
- **Purpose**: Personalization and recommendations
- **Tech**: PostgreSQL + ML models
- **Features**:
  - User behavior tracking
  - Preference learning
  - Personalized results
  - A/B testing

### Data Flow

1. **User Query** → Frontend captures input
2. **Query Classification** → AI determines query type
3. **Parallel Retrieval**:
   - Search Service → Elasticsearch
   - Knowledge Graph → Neo4j
   - AI Summary → Gemini API
4. **Result Aggregation** → Backend combines results
5. **Visualization** → Frontend renders interactive UI

### Scalability Strategy

- **Horizontal Scaling**: Microservices can scale independently
- **Caching**: Redis for frequently accessed data
- **Load Balancing**: Nginx distributes traffic
- **Queue System**: Google Pub/Sub for async tasks
- **CDN**: Static assets served via CDN

### Google Cloud Platform Integration

- **Cloud Run**: Containerized microservices
- **Cloud Storage**: Static assets and backups
- **BigQuery**: Analytics and data warehouse
- **Cloud Pub/Sub**: Message queue
- **Cloud Monitoring**: Prometheus + Grafana

## Interview Talking Points

1. **System Design**: Explain microservices architecture
2. **Scalability**: Discuss horizontal scaling and caching
3. **AI Integration**: Show Gemini API usage
4. **Data Structures**: Graph databases for relationships
5. **Performance**: Parallel queries, caching strategies
6. **Real-time**: WebSocket for live updates
7. **Search Optimization**: Elasticsearch indexing
