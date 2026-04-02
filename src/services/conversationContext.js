// Conversation Context Service
// Manages conversation state and language detection

import { detectLanguage, getSystemPrompt } from '../utils/languageDetector.js';

class ConversationContext {
  constructor() {
    this.currentLanguage = 'en'; // Use ISO code for consistency
    this.isProcessing = false;
    this.isListening = false;
    this.isSpeaking = false;
    this.conversationStartTime = Date.now();
    this.messageCount = 0;
    this.userMessages = [];
    this.assistantResponses = [];
    this.lastUserMessage = '';
    this.lastAssistantResponse = '';
  }

  /**
   * Detect and set language from text
   * @param {string} text - Input text to detect language from
   */
  detectAndSetLanguage(text) {
    const detected = detectLanguage(text);

    // Only update if we have confidence
    if (detected !== 'unknown') {
      this.currentLanguage = detected;
      console.log(`Language detected: ${detected}`);
    } else if (this.currentLanguage === 'unknown') {
      // Default to English for first message
      this.currentLanguage = 'english';
    }

    return this.currentLanguage;
  }

  /**
   * Get current language
   * @returns {string}
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get system prompt for current context
   * @returns {string}
   */
  getSystemPrompt() {
    return getSystemPrompt(this.currentLanguage);
  }

  /**
   * Add user message to context
   * @param {string} message
   */
  addUserMessage(message) {
    this.lastUserMessage = message;
    this.userMessages.push({
      text: message,
      timestamp: Date.now(),
      language: this.currentLanguage
    });
    this.messageCount++;
  }

  /**
   * Add assistant response to context
   * @param {string} response
   */
  addAssistantResponse(response) {
    this.lastAssistantResponse = response;
    this.assistantResponses.push({
      text: response,
      timestamp: Date.now(),
      language: this.currentLanguage
    });
    this.messageCount++;
  }

  /**
   * Set processing state
   * @param {boolean} processing
   */
  setProcessing(processing) {
    this.isProcessing = processing;
  }

  /**
   * Set listening state
   * @param {boolean} listening
   */
  setListening(listening) {
    this.isListening = listening;
  }

  /**
   * Set speaking state
   * @param {boolean} speaking
   */
  setSpeaking(speaking) {
    this.isSpeaking = speaking;
  }

  /**
   * Get current status
   * @returns {Object}
   */
  getStatus() {
    return {
      isProcessing: this.isProcessing,
      isListening: this.isListening,
      isSpeaking: this.isSpeaking,
      language: this.currentLanguage,
      messageCount: this.messageCount,
      conversationDuration: Date.now() - this.conversationStartTime
    };
  }

  /**
   * Get last user message
   * @returns {string}
   */
  getLastUserMessage() {
    return this.lastUserMessage;
  }

  /**
   * Get last assistant response
   * @returns {string}
   */
  getLastAssistantResponse() {
    return this.lastAssistantResponse;
  }

  /**
   * Reset conversation
   */
  reset() {
    this.currentLanguage = 'en';
    this.isProcessing = false;
    this.isListening = false;
    this.isSpeaking = false;
    this.conversationStartTime = Date.now();
    this.messageCount = 0;
    this.userMessages = [];
    this.assistantResponses = [];
    this.lastUserMessage = '';
    this.lastAssistantResponse = '';
  }

  /**
   * Get conversation summary
   * @returns {Object}
   */
  getSummary() {
    return {
      totalMessages: this.messageCount,
      userMessages: this.userMessages.length,
      assistantResponses: this.assistantResponses.length,
      primaryLanguage: this.currentLanguage,
      conversationDuration: Date.now() - this.conversationStartTime
    };
  }
}

// Export singleton instance
export const conversationContext = new ConversationContext();
