AisleMart: Voice-First Premium Retail OS

AisleMart is a highly optimized, multilingual voice assistant designed for the next generation of retail environments. It enables a "hands-free" shopping experience using advanced speech-to-text, real-time LLM processing, and high-fidelity Indian-language TTS.

---

## Technical Architecture

AisleMart operates as a sophisticated pipeline of three core phases: **Perception**, **Cognition**, and **Sensation**.

 1. Perception (Speech-to-Text)
The system leverages the **Web Speech API** for ultra-low latency recognition.
- **Continuous Listening**: The assistant maintains an active `webkitSpeechRecognition` state, specifically tuned for short retail phrases.
- **Multilingual Support**: Automatically detects and switches between English, Hindi, Tamil, Telugu, Malayalam, Kannada, and Marathi.
- **Smart Thresholding**: Filters background noise and only triggers processing when meaningful transcripts are generated.

### 2. Cognition (LLM Intelligence)
Once the transcript is ready, it is routed through a high-performance LLM pipeline:
- **Primary Model**: `llama-3.1-8b-instant` (via Groq) for sub-second response times.
- **Context Injection**: Every query is augmented with a real-time product database including prices, aisles, and stock status.
- **Smart Product Identification**: A custom regex-based matching algorithm in the client-side `App.jsx` parses the AI's response to extract product IDs and dynamically render corresponding UI cards.
- **Fallback Logic**: Implements an automatic transition to **OpenRouter** (Claude-3/Mistral-Large) if the primary API experiences latency spikes.

### 3. Sensation (TTS & UI Rendering)
The final stage transforms the text into human-like audio and visual feedback.
- **Sarvam AI TTS**: Utilizes specialized Indian-language models to provide natural, accent-accurate audio responses.
- **Glassmorphic UI Engine**: Built with **React 19** and **Tailwind CSS 4**. Uses high-performance CSS animations (via `framer-motion` concepts) for localized product reveals.
- **Responsive Layout**: Adopts a mobile-first philosophy with modular components that adapt to different aspect ratios without losing the premium retail aesthetic.

---

## Stack & Specifications

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 8 | Core framework & high-speed build tool |
| **Styling** | Tailwind CSS 4 | Utility-first styling with modern glassmorphism |
| **Brain** | Llama 3.1 8B (Groq) | Ultra-fast LLM for retail intent parsing |
| **Speech** | Web Speech API | Client-side real-time transcription |
| **Voice** | Sarvam AI | Specialized Indian TTS (Hindi, Tamil, etc.) |
| **State** | Custom Context Hooks | Managing conversation history and language state |

---

## Operational Flow

1.  **Wake Phase**: User says a product name or asks a question.
2.  **Detection**: `languageDetector.js` identifies the script/language and selects the matching system prompt.
3.  **Inference**: The query is sent to Groq. Max tokens are capped at 80-100 to ensure <1s TTFT (Time to First Token).
4.  **UI Sync**: `ProductCard.jsx` instances are generated based on parsed tokens from the LLM output.
5.  **Audio Sync**: The voice begins speaking simultaneously with the UI animation to minimize perceived latency.

---

##  Installation & Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file with:
   ```env
   VITE_GROQ_API_KEY=your_key
   VITE_OPENROUTER_API_KEY=your_key
   VITE_SARVAM_API_KEY=your_key
   ```

3. **Launch**:
   ```bash
   npm run dev
   ```

---
*Developed as a high-performance prototype for AisleMart Premium Retail OS.*
