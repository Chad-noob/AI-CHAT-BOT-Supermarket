# Quick Setup Guide - Groq API Version

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Get Groq API Key (FREE, Fast, Unlimited)
1. Visit **[console.groq.com/keys](https://console.groq.com/keys)**
2. Sign up for a free account (no credit card required)
3. Click "Create API Key"
4. Copy your API key (starts with `gsk_`)

### Step 3: Create .env File
```bash
# Copy the example
cp .env.example .env

# Edit .env and paste your Groq API key
VITE_GROQ_API_KEY=gsk_your_actual_key_here
```

### Step 4: Start the App
```bash
npm run dev
```

### Step 5: Grant Microphone Access
1. Open browser to `http://localhost:5173`
2. Click "Allow" when prompted for microphone
3. Start talking!

## Test Commands

Try these after clicking the microphone:

**English:**
- "Where is rice?"
- "What is the price of milk?"
- "Show me offers"
- "Where can I find sugar?"
- "How much do eggs cost?"

**Tamil:**
- "உயர் ரவை எங்கே?" (Where is rice?)
- "பால் விலை எத்தனை?" (What is milk price?)
- "விலை Chennai எங்கே?" (Where is the price section?)

## Troubleshooting

### API Key Issues
- Make sure you added `VITE_GROQ_API_KEY` to `.env` (not `.env.example`)
- Restart the dev server after creating `.env`
- Key should start with `gsk_` (Groq format)
- Check console for "Groq API key not configured" error

### Rate Limits
- Groq free tier has **no strict rate limits**
- May occasionally queue during high demand (wait 10-30s)
- If you get 503, the model is loading - wait and retry

### Microphone Not Working
- Use Chrome, Edge, or Safari (Firefox not supported)
- Grant microphone permission when prompted
- Check browser console for errors
- Ensure you're on `localhost` or HTTPS

## Project Structure

```
ai-voice/
├── src/
│   ├── services/           # AI/voice services (now using Groq)
│   ├── components/         # UI components
│   ├── hooks/             # Voice assistant hook
│   ├── utils/             # Language detection
│   └── App.jsx            # Main app
├── .env.example           # Shows VITE_GROQ_API_KEY
├── .env                   # Your API key goes here
├── README.md              # Full documentation (updated for Groq)
├── SETUP.md               # This file
└── package.json           # Dependencies
```

## Next Steps

1. Customize store info in `src/utils/languageDetector.js`
2. Add more Tamil vocabulary for better detection
3. Adjust voice settings in `src/services/textToSpeech.js`
4. Deploy to Vercel/Netlify for public access

## Why Groq?

- ✅ **Completely FREE** (no rate limits)
- ✅ **Blazing fast** (LPU hardware, <1s responses)
- ✅ **Great models** (Llama 3.3 70B, Llama 3.1 8B, Gemma 2)
- ✅ **No credit card needed**
- ✅ **Production-ready**

Need help? Check the main README.md for detailed documentation.

---

**AisleMart AI Voice Assistant v1.1 - Powered by Groq 🚀**