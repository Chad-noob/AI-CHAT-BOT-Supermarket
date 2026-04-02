# SoundMart

A modern, voice-enabled AI assistant web application built with React and Vite. SoundMart provides an intuitive interface for voice-based interactions with advanced AI models, real-time speech processing, and multilingual support.

## Features

- **Voice Input**: Real-time speech recognition with continuous listening mode
- **Text-to-Speech**: Natural language synthesis with voice customization
- **Multilingual Support**: Automatic language detection and multilingual responses
- **AI-Powered**: Integration with leading LLM providers (OpenRouter, Groq)
- **Conversation Context**: Maintains conversation history for contextual exchanges
- **Fast & Responsive**: Lightning-fast builds and near-instant responses
- **Modern UI**: Clean, responsive design optimized for all devices
- **Dark Mode**: Comfortable viewing experience in any environment

## Project Structure

```
SoundMart/
├── src/
│   ├── components/          # React UI components
│   │   ├── Header.jsx
│   │   ├── VoiceButton.jsx
│   │   ├── ResponseDisplay.jsx
│   │   ├── TranscriptDisplay.jsx
│   │   ├── StatusIndicator.jsx
│   │   ├── ThinkingIndicator.jsx
│   │   ├── WaveformAnimation.jsx
│   │   └── LanguageSelector.jsx
│   ├── hooks/               # Custom React hooks
│   │   └── useVoiceAssistant.js
│   ├── services/            # Business logic & API services
│   │   ├── speechRecognition.js
│   │   ├── textToSpeech.js
│   │   ├── llmService.js
│   │   └── conversationContext.js
│   ├── utils/               # Utility functions
│   │   └── languageDetector.js
│   ├── assets/              # Static images and media
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Public assets
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint rules
└── index.html               # HTML entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern browser with Web Speech API support (Chrome, Edge, Safari)

### Installation

1. **Clone the repository and install dependencies**:
```bash
git clone https://github.com/arun-r-007/SoundMart.git
cd SoundMart
npm install
```

2. **Configure environment variables**:
   - Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   - Add your API keys:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_key_here
   VITE_LLM_MODEL=openrouter/meta-llama/llama-2-70b-chat
   VITE_DEFAULT_LANGUAGE=en
   ```

3. **Start the development server**:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173` (or the port shown in terminal)

### Browser Requirements

- Microphone access (you'll be prompted for permission)
- Modern browser with Web Speech API support
- For best results, use Chrome or Edge

## � Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENROUTER_API_KEY` | OpenRouter API key for LLM access | Yes |
| `VITE_GROQ_API_KEY` | Groq API key (alternative provider) | No |
| `VITE_LLM_MODEL` | Selected LLM model | Yes |
| `VITE_DEFAULT_LANGUAGE` | Default language (en, es, fr, etc.) | No |

**Getting API Keys:**
- **OpenRouter**: Sign up at [openrouter.ai](https://openrouter.ai) for API access
- **Groq**: Get a free key from [console.groq.com](https://console.groq.com/keys)

## Usage

1. **Click the microphone button** to start listening
2. **Speak your query** clearly
3. The assistant processes your speech and responds in real-time
4. **Listen to the audio response** or read the text
5. Click the microphone again to continue the conversation

### Supported Interactions

- Natural language questions and commands
- Multi-turn conversations with context awareness
- Language-specific responses
- Voice volume and speed customization

## Technical Details

### Speech Recognition
- **API**: Web Speech API (`SpeechRecognition`)
- **Mode**: Continuous listening with interim results
- **Auto-stop**: Detects silence and stops automatically
- **Languages**: Supports multiple languages with auto-detection

### Language Detection
- Automatic language detection from user speech
- Multi-language support for responses
- Consistent language handling throughout conversation
- Fallback mechanisms for ambiguous input

### LLM Integration
- **Supported Providers**: 
  - OpenRouter: Access to 100+ LLM models
  - Groq: Ultra-fast inference
- **Conversation History**: Maintains context across interactions
- **Response Optimization**: Fine-tuned prompts for better results
- **Configurable Models**: Easy model switching

### Text-to-Speech
- **API**: Web Speech Synthesis API
- **Features**: Multiple voices, adjustable rate and pitch
- **Interruption**: Cancels ongoing speech on new input
- **Quality**: Natural-sounding responses

## Customization

### Change AI Provider

Edit `src/services/llmService.js`:
```javascript
// Switch between providers
const provider = 'openrouter'; // or 'groq'
```

### Customize Voice Settings

Edit `src/services/textToSpeech.js`:
```javascript
this.rate = 1.0;      // Speed: 0.1-10
this.pitch = 1.0;     // Pitch: 0-2
this.volume = 1.0;    // Volume: 0-1
```

### Modify Silence Detection

Edit `src/services/speechRecognition.js`:
```javascript
this.silenceThreshold = 2000; // Milliseconds of silence before stopping
```

## Troubleshooting

### Speech Recognition Not Working
- Ensure microphone permissions are granted
- Check browser console for errors
- Use Chrome or Edge for best compatibility
- HTTPS or localhost required for microphone access

### No Audio Output
- Check if text-to-speech is supported
- Ensure audio is not muted
- Check speaker output is enabled
- Verify browser volume settings

### API Connection Issues
- Verify API keys in `.env` file
- Check internet connection
- Ensure API keys are valid and active
- Try alternative LLM provider

### Performance Issues
- Clear browser cache and cookies
- Disable browser extensions
- Check network speed and latency
- Try reducing API request frequency

## Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Speech Recognition | Yes | Yes | Yes | No |
| Speech Synthesis | Yes | Yes | Yes | Yes |
| API Integration | Yes | Yes | Yes | Yes |

**Recommended**: Chrome or Edge for full voice functionality.

## Implemented Features

- Real-time voice recognition and waveform visualization
- Natural language responses with text-to-speech
- Conversation history tracking
- Multilingual support with automatic detection
- Responsive design for all devices
- Smooth animations and visual feedback
- Error handling and graceful degradation
- Customizable AI models and voice settings
- Conversation context management

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3
- **APIs**: Web Speech API, REST APIs
- **LLM Providers**: OpenRouter, Groq
- **Linting**: ESLint

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to:
- Fork the repository
- Create a feature branch
- Submit a pull request
- Report issues and suggestions

## Resources

- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [OpenRouter API](https://openrouter.ai)
- [Groq API](https://groq.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## Author

- [arun-r-007](https://github.com/arun-r-007)

## Support

For issues, feature requests, or questions:
- Open an issue on [GitHub](https://github.com/arun-r-007/SoundMart)
- Check existing documentation in the project
- Review troubleshooting section above

---

**Made with care for voice-enabled AI interactions**
