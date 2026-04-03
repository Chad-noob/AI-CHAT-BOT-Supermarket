Aisle Mart - AI Voice Assistant Supermarket

AisleMart is a modern, voice-first supermarket information assistant designed to provide a seamless and intuitive shopping experience. Users can ask questions in multiple languages to find product locations, check prices, and discover current offers. The interface features a cinematic, full-screen voice assistant mode with a premium, glassmorphism design.

This project was built with React, Vite, and Tailwind CSS, and integrates with advanced AI services for natural language understanding (Groq, OpenRouter) and speech synthesis (Sarvam AI, Web Speech API).
Key Features
 Voice-First Interaction: A full-screen, immersive voice assistant interface.
 Multi-Language Support: Automatically detects and responds in multiple languages including English, Hindi, Tamil, Telugu, and more.
 AI-Powered Responses: Utilizes powerful LLMs (Llama 3 via Groq) to provide natural and accurate answers about products and offers.
 Premium UI/UX: A modern, "glassmorphism" design with smooth animations, glowing effects, and a responsive layout.
 Cinematic Entry Flow: A unique greeting animation that cycles through "Hello" in various languages, followed by a spoken welcome message.
 Dynamic Product Cards: Visually displays product cards in the UI whenever a product is mentioned by the AI.
 Fast & Performant: Built with Vite for a lightning-fast development experience and optimized production builds.
 
 Tech Stack
Frontend: React 18, Vite, Tailwind CSS
State Management: React Hooks & Context API
AI & Language Models:
LLM: Groq (primary, for speed) & OpenRouter (fallback)
Speech Recognition: Web Speech API (SpeechRecognition)
Text-to-Speech (TTS): Sarvam AI (for Indian languages) & Web Speech API (SpeechSynthesis)
Deployment: Ready for Vercel, Netlify, or any static host.

 Getting Started
Follow these instructions to get the project up and running on your local machine.

Prerequisites
Node.js (v18.x or higher)
npm or yarn
1. Clone the Repository
2. Install Dependencies
3. Set Up Environment Variables
Create a .env file in the root of your project by copying the example file:

Now, open the .env file and add your API keys. You need at least one of the following:

Note: The application will prioritize Groq for its speed. OpenRouter is used as a fallback.

4. Run the Development Server
The application will be available at http://localhost:5173.

How It Works
Greeting Flow: The app starts with GreetingAnimation.jsx, which transitions to WelcomeTransition.jsx.
Voice UI: After the welcome, App.jsx renders the main VoiceAssistantUI.jsx.
Speech Recognition: The useVoiceAssistant.js hook captures user audio via the Web Speech API.
LLM Service: The transcribed text is sent to llmService.js, which queries the Groq API for a response.
Product Matching: App.jsx scans the AI's text response for product keywords (from products.js).
Dynamic Rendering: If a product is found, its ProductCard.jsx is rendered in the center of the voice UI.
Text-to-Speech: The AI's response is spoken aloud using textToSpeech.js, which leverages Sarvam AI for regional languages or the browser's default for others.
