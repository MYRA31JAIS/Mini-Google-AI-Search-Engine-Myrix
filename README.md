# 🔍 Mini Google AI - Intelligent Search Engine

<div align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Production-success)

**A modern, AI-powered search engine with RAG capabilities, multi-view interfaces, and mood-based theming.**

[Features](#-features) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Usage](#-usage)

</div>

---

## ✨ Features

### 🤖 AI-Powered Search
- **RAG Pipeline** - Retrieval-Augmented Generation for accurate, context-aware answers
- **Real-time Search** - Live Google search results via SERP API
- **Semantic Search** - MiniLM embeddings for intelligent result ranking
- **AI Chatbot** - 6 personality modes (Normal, Study, Roast, Love, Tutor, Coding)

### 🎨 Innovative UI/UX
- **3 View Modes** - Standard, Cards, and Slides presentation
- **Mood-Based Themes** - 7 dynamic backgrounds (Sad, Happy, Study, Romantic, Energetic, Calm, Dark)
- **Pastel Card Design** - Vibrant, flippable cards with smooth animations
- **Presentation Mode** - Slide-based content navigation
- **Fully Responsive** - Mobile, tablet, and desktop optimized

### 🚀 Performance
- **In-Memory Caching** - 50-100x faster repeat searches (<50ms)
- **Parallel Processing** - Simultaneous API calls for optimal speed
- **Progressive Loading** - Critical features load first
- **Graceful Degradation** - Fallback content when AI unavailable

### 🎯 Smart Features
- **Knowledge Graphs** - Entity information with cute pastel cards
- **Autocomplete** - Trie-based search suggestions
- **People Also Ask** - Related questions with expandable answers
- **Instant Answers** - Date, time, calculator, weather integration
- **Trend Charts** - Visual data representation with D3.js

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** - Type-safe component architecture
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **TanStack Query** - Data fetching and caching
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** + **Express** - RESTful API server
- **Google Gemini AI** - Advanced language model for RAG
- **SERP API** - Real-time Google search results
- **OpenWeather API** - Weather data integration
- **Sentence Transformers** - Semantic embeddings (MiniLM)

### Architecture
- **Microservices Design** - Modular service architecture
- **Context API** - Global state management
- **Custom Hooks** - Reusable React logic
- **Trie Data Structure** - Efficient autocomplete
- **O(1) Caching** - High-performance data retrieval

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API Keys (Gemini, SERP, OpenWeather)

### Quick Start

```bash
# Clone repository
git clone https://github.com/MYRA31JAIS/Mini-Google-AI-Search-Engine-Myrix.git
cd Mini-Google-AI-Search-Engine-Myrix

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env and add your API keys

# Run development servers (from root directory)
cd ..
npm run dev
```

### Get API Keys

1. **Gemini AI**: https://makersuite.google.com/app/apikey
2. **SERP API**: https://serpapi.com/
3. **OpenWeather**: https://openweathermap.org/api

---

## 🚀 Usage

1. **Search** - Enter any query in the search bar
2. **Switch Views** - Toggle between Standard, Cards, and Slides
3. **Change Mood** - Click mood tags to change background theme
4. **Chat with AI** - Use the floating chatbot with different personalities
5. **Explore Results** - Click cards to flip, navigate slides, view knowledge graphs

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| First Search | ~15-20 seconds |
| Cached Search | <50ms (instant) |
| Performance Gain | 50-100x with caching |
| Failure Rate | 0% (graceful fallbacks) |
| Mobile Support | ✅ Fully responsive |

---

## 🏗️ Project Structure

```
Mini-Google-AI/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React contexts
│   │   └── services/      # API service layer
│   └── package.json
├── backend/               # Node.js + Express backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── services/      # Business logic services
│   │   └── index.js       # Server entry point
│   └── package.json
├── .gitignore
├── README.md
└── package.json
```

---

## 🎯 Key Highlights

- ✅ **Production-Ready** - Error handling, fallbacks, optimization
- ✅ **Scalable Architecture** - Modular design for easy feature additions
- ✅ **Beautiful UI** - Modern, aesthetic design with smooth animations
- ✅ **Fast Performance** - Optimized caching and parallel processing
- ✅ **Mobile-First** - Responsive design for all devices
- ✅ **AI-Enhanced** - Smart answers with RAG pipeline

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language models
- **SERP API** for real-time search data
- **OpenWeather** for weather integration
- **Open-source community** for amazing tools and libraries

---

## 📧 Contact

**Myra Jaiswal**
- GitHub: [@MYRA31JAIS](https://github.com/MYRA31JAIS)
- Repository: [Mini-Google-AI-Search-Engine-Myrix](https://github.com/MYRA31JAIS/Mini-Google-AI-Search-Engine-Myrix)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ and ☕ by Myra Jaiswal

</div>
