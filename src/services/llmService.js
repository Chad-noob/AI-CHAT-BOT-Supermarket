// LLM Service using Groq API (primary) with OpenRouter fallback
// Groq is more stable and faster for this use case

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Groq models (fast and stable)
const GROQ_MODELS = {
  quick: 'llama-3.3-70b-versatile',
  balanced: 'llama-3.1-8b-instant',
  capable: 'llama-3.3-70b-versatile'
};

// OpenRouter fallback models
const OPENROUTER_MODELS = {
  quick: 'anthropic/claude-3.5-sonnet',
  balanced: 'mistralai/mistral-large',
  capable: 'anthropic/claude-3-opus'
};

class LLMService {
  constructor(apiKey = null) {
    this.maxTokens = 100;  // Reduced from 150 for faster responses
    this.temperature = 0.5;  // Reduced from 0.7 for faster/more predictable responses
    this.timeout = 10000;  // Reduced from 15000
    this.conversationHistory = [];
    this.maxHistory = 5;  // Reduced from 10 for faster processing
    this.lastUsedProvider = 'groq'; // Track which provider worked last
    this._groqKeyCache = null;
    this._openrouterKeyCache = null;
  }

  // Lazy getters that read from environment at call time
  get groqApiKey() {
    if (this._groqKeyCache === null) {
      this._groqKeyCache = import.meta.env.VITE_GROQ_API_KEY || '';
    }
    return this._groqKeyCache;
  }

  get openrouterApiKey() {
    if (this._openrouterKeyCache === null) {
      this._openrouterKeyCache = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    }
    return this._openrouterKeyCache;
  }

  // Force refresh from environment (useful for debugging)
  refreshApiKeys() {
    this._groqKeyCache = import.meta.env.VITE_GROQ_API_KEY || '';
    this._openrouterKeyCache = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    console.log('🔄 API Keys refreshed:');
    console.log(`  ✓ Groq: ${this._groqKeyCache ? '✅ ' + this._groqKeyCache.substring(0, 10) + '...' : '❌ Missing'}`);
    console.log(`  ✓ OpenRouter: ${this._openrouterKeyCache ? '✅ ' + this._openrouterKeyCache.substring(0, 10) + '...' : '❌ Missing'}`);
  }

  /**
   * Set API key (for backward compatibility)
   * @param {string} apiKey
   */
  setApiKey(apiKey) {
    // Try to detect if it's Groq or OpenRouter
    if (apiKey?.includes('gsk')) {
      this.groqApiKey = apiKey;
    } else if (apiKey?.includes('sk-or')) {
      this.openrouterApiKey = apiKey;
    }
  }

  /**
   * Send message - tries Groq first, falls back to OpenRouter
   * @param {string} message - User message
   * @param {string} context - System context
   * @param {boolean} isNewConversation - Reset history flag
   * @returns {Promise<string>} - Model response
   */
  async sendMessage(message, context = '', isNewConversation = false) {
    // Check keys at call time (not init time)
    const groqKey = this.groqApiKey;
    const openrouterKey = this.openrouterApiKey;

    if (!groqKey && !openrouterKey) {
      console.error('❌ API KEY ERROR - Both keys are missing!');
      console.error('Groq Key:', groqKey ? 'Present ✅' : 'MISSING ❌');
      console.error('OpenRouter Key:', openrouterKey ? 'Present ✅' : 'MISSING ❌');
      console.error('Environment variables available:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')).join(', '));
      throw new Error(`❌ API Keys Missing!\n\nAdd to .env:\nVITE_GROQ_API_KEY=your_key\nVITE_OPENROUTER_API_KEY=your_key\n\nThen restart dev server: npm run dev\n\nAvailable env vars: ${Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')).join(', ')}`);
    }

    // Reset history if new conversation
    if (isNewConversation) {
      this.conversationHistory = [];
    }

    // Build messages array
    const messages = [];

    // Add system prompt (simplified to reduce token usage)
    if (context) {
      messages.push({
        role: 'system',
        content: context
      });
    }

    // Add conversation history
    messages.push(...this.conversationHistory);

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    // Try Groq first (faster, more stable)
    if (this.groqApiKey) {
      try {
        console.log('🚀 Trying Groq API...');
        const response = await this.callGroqAPI(messages);
        this.lastUsedProvider = 'groq';
        this.updateHistory(message, response);
        return response;
      } catch (error) {
        console.warn('⚠️ Groq failed:', error.message);
        // Fall through to OpenRouter
      }
    }

    // Fall back to OpenRouter
    if (this.openrouterApiKey) {
      try {
        console.log('🚀 Trying OpenRouter API...');
        const response = await this.callOpenRouterAPI(messages);
        this.lastUsedProvider = 'openrouter';
        this.updateHistory(message, response);
        return response;
      } catch (error) {
        console.error('❌ OpenRouter failed:', error.message);
        throw error;
      }
    }

    throw new Error('No working API available');
  }

  /**
   * Call Groq API
   */
  async callGroqAPI(messages) {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.groqApiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODELS.quick,
        messages: messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        stream: false
      }),
      signal: AbortSignal.timeout(this.timeout)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
      throw new Error(`Groq API error: ${errorMsg}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Groq');
    }

    return data.choices[0].message.content.trim();
  }

  /**
   * Call OpenRouter API
   */
  async callOpenRouterAPI(messages) {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openrouterApiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Voice Assistant'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODELS.quick,
        messages: messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        stream: false
      }),
      signal: AbortSignal.timeout(this.timeout)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
      throw new Error(`OpenRouter API error: ${errorMsg}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenRouter');
    }

    return data.choices[0].message.content.trim();
  }

  /**
   * Update conversation history
   */
  updateHistory(userMessage, assistantResponse) {
    this.conversationHistory.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantResponse }
    );

    // Trim if too long
    if (this.conversationHistory.length > this.maxHistory * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistory * 2);
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   * @returns {Array}
   */
  getHistory() {
    return [...this.conversationHistory];
  }

  /**
   * Check if API key is configured
   * @returns {boolean}
   */
  isConfigured() {
    return (!!this.groqApiKey && this.groqApiKey.length > 10) || (!!this.openrouterApiKey && this.openrouterApiKey.length > 10);
  }

  /**
   * Get available models
   * @returns {Object}
   */
  static getModels() {
    return { 
      groq: { ...GROQ_MODELS },
      openrouter: { ...OPENROUTER_MODELS }
    };
  }
}

// Export singleton instance
export const llmService = new LLMService();

// Also export as default for direct instantiation
export default LLMService;
