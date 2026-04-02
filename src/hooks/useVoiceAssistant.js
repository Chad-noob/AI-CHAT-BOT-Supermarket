// Custom hook for Voice Assistant
// Orchestrates speech recognition, LLM, and TTS

import { useState, useEffect, useCallback, useRef } from 'react';
import { speechRecognition } from '../services/speechRecognition.js';
import { textToSpeech } from '../services/textToSpeech.js';
import { llmService } from '../services/llmService.js';
import { conversationContext } from '../services/conversationContext.js';

export function useVoiceAssistant(selectedLanguage = 'en') {
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [language, setLanguage] = useState('english');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [error, setError] = useState(null);
  const [explicitLanguage, setExplicitLanguage] = useState(selectedLanguage);

  // Refs for current state to avoid stale closures
  const currentStatusRef = useRef(status);
  const currentTranscriptRef = useRef(transcript);
  const currentResponseRef = useRef(response);
  const explicitLanguageRef = useRef(explicitLanguage);

  // Update refs on state changes
  useEffect(() => {
    currentStatusRef.current = status;
    currentTranscriptRef.current = transcript;
    currentResponseRef.current = response;
    explicitLanguageRef.current = explicitLanguage;
  }, [status, transcript, response, explicitLanguage]);

  // Update explicit language when prop changes
  useEffect(() => {
    setExplicitLanguage(selectedLanguage);
  }, [selectedLanguage]);

  /**
   * Update conversation history state
   */
  const updateConversationHistory = useCallback(() => {
    // getSummary is used, but we don't need to assign it since we do not use 'summary'
    conversationContext.getSummary();
    setConversationHistory([
      {
        user: conversationContext.getLastUserMessage(),
        assistant: conversationContext.getLastAssistantResponse(),
        language: conversationContext.getLanguage()
      },
      ...conversationContext.userMessages
        .slice(-5)
        .map((msg, idx) => ({
          user: msg.text,
          assistant: conversationContext.assistantResponses[conversationContext.assistantResponses.length - 5 + idx]?.text || '',
          language: msg.language
        }))
    ].filter(item => item.user || item.assistant));
  }, []);

  /**
   * Process user input: detect language, get LLM response, speak
   * @param {string} userText
   */
  const processUserInput = useCallback(async (userText) => {
    if (!userText.trim()) return;

    setStatus('processing');
    setError(null);
    conversationContext.setProcessing(true);

    try {
      // Use explicit language selection if available, fall back to detection
      let detectedLanguage = explicitLanguageRef.current;

      // If explicit language is 'auto', auto-detect from user text
      if (detectedLanguage === 'auto') {
        conversationContext.detectAndSetLanguage(userText);
        detectedLanguage = conversationContext.getLanguage();
      } else {
        // Force the explicit language selection (e.g., 'ta', 'ml', 'en', 'hi')
        conversationContext.currentLanguage = detectedLanguage;
      }

      console.log('✅ Using language for LLM & TTS:', detectedLanguage);
      setLanguage(detectedLanguage);

      // Add to conversation context
      conversationContext.addUserMessage(userText);
      updateConversationHistory();

      // Get system prompt with context
      const systemPrompt = conversationContext.getSystemPrompt();

      // Get LLM response
      const rawLlmResponse = await llmService.sendMessage(
        userText,
        systemPrompt,
        conversationContext.messageCount === 1
      );

      let llmResponse = rawLlmResponse;

      // Update state
      setResponse(llmResponse);
      conversationContext.addAssistantResponse(llmResponse);
      updateConversationHistory();


      // Speak response using EXPLICIT language for TTS
      if (llmResponse) {
        console.log('Speaking response in language:', detectedLanguage);
        textToSpeech.speak(llmResponse, detectedLanguage);
      }
    } catch (err) {
      console.error('Error processing input:', err);
      setError(err.message || 'Failed to process your request');
      setStatus('idle');
      conversationContext.setProcessing(false);
    }
  }, [updateConversationHistory]);

  /**
   * Handle speech recognition results
   * @param {Object} result - { interim, final, isFinal, currentTranscript }
   */
  const handleSpeechResult = useCallback((result) => {
    if (result.interim) {
      setInterimTranscript(result.interim);
    }

    if (result.final) {
      const finalText = result.final.trim();
      if (finalText) {
        setTranscript(finalText);
        setInterimTranscript('');
        processUserInput(finalText);
      }
    }
  }, [processUserInput]);

  /**
   * Handle speech recognition errors
   * @param {string} error
   */
  const handleSpeechError = useCallback((error) => {
    console.error('Speech recognition error:', error);
    setError(error);
    setStatus('idle');
  }, []);

  /**
   * Initialize services
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize speech recognition
        const speechInitialized = await speechRecognition.initialize();
        if (!speechInitialized) {
          setError('Speech recognition failed to initialize');
          return;
        }

        // Set up speech recognition callbacks
        speechRecognition.onResult = handleSpeechResult;
        speechRecognition.onError = handleSpeechError;
        speechRecognition.onStart = () => {
          setStatus('listening');
          setTranscript(prev => prev || 'Listening...');
        };
        speechRecognition.onEnd = () => {
          if (currentStatusRef.current === 'listening') {
            setStatus('idle');
          }
        };

        // Set up text-to-speech callbacks
        textToSpeech.onStart = () => {
          setStatus('speaking');
        };
        textToSpeech.onEnd = () => {
          setStatus('idle');
        };
        textToSpeech.onError = (error) => {
          console.error('Speech synthesis error:', error);
          // Don't set error - keep response visible even if TTS fails
          setStatus('idle');
        };
      } catch (err) {
        setError(`Initialization error: ${err.message}`);
      }
    };

    initialize();

    // Cleanup on unmount
    return () => {
      speechRecognition.destroy();
      // Don't destroy TTS singleton - just stop any ongoing speech
      // to avoid HMR issues with event listeners
      textToSpeech.stop();
    };
  }, [handleSpeechResult, handleSpeechError]);

  /**
   * Toggle listening state
   */
  const toggleListening = useCallback(async () => {
    if (conversationContext.isSpeaking) {
      // Interrupt speech if user starts talking
      textToSpeech.stop();
      conversationContext.setSpeaking(false);
    }

    // Clear error
    setError(null);

    // Determine recognition language
    let recognitionLang = explicitLanguageRef.current;
    if (recognitionLang === 'auto') {
      // Use language from conversation context if available and not English
      const ctxLang = conversationContext.getLanguage();
      if (ctxLang && ctxLang !== 'en') {
        recognitionLang = ctxLang;
        console.log('Auto mode: using conversation language for recognition:', recognitionLang);
      } else {
        // No prior conversation, try to infer from browser's language preferences
        const browserLanguages = (navigator.languages && navigator.languages.length)
          ? navigator.languages
          : [navigator.language, navigator.userLanguage];

        // Find first supported language from browser preferences
        for (const browserLang of browserLanguages) {
          const code = browserLang.split('-')[0].toLowerCase();
          if (speechRecognition.languageMap[code]) {
            recognitionLang = code;
            console.log('Auto mode: using browser language for recognition:', recognitionLang, '(from', browserLang, ')');
            break;
          }
        }
        // If no supported language found, default to 'en'
        if (!speechRecognition.languageMap[recognitionLang]) {
          recognitionLang = 'en';
        }
      }
    }

    // Set recognition language BEFORE listening
    console.log('Setting recognition language to:', recognitionLang);
    speechRecognition.setLanguage(recognitionLang);

    // Use non-continuous mode - only record once per click
    speechRecognition.setContinuousMode(false);

    await speechRecognition.toggle();
  }, []);

  /**
   * Stop listening and speaking
   */
  const stopAll = useCallback(() => {
    speechRecognition.stop();
    textToSpeech.stop();
    conversationContext.setListening(false);
    conversationContext.setSpeaking(false);
    setStatus('idle');
  }, []);

  /**
   * Start new conversation
   */
  const startNewConversation = useCallback(() => {
    stopAll();
    conversationContext.reset();
    setTranscript('');
    setResponse('');
    setInterimTranscript('');
    setConversationHistory([]);
    setLanguage('english');
    setError(null);
  }, [stopAll]);

  /**
   * Retry last interaction
   */
  const retryLast = useCallback(async () => {
    const lastMessage = conversationContext.getLastUserMessage();
    if (lastMessage) {
      await processUserInput(lastMessage);
    }
  }, [processUserInput]);

  // Derived state
  const isApiConfigured = llmService.isConfigured();
  const processing = status === 'processing';
  const listening = status === 'listening';
  const speaking = status === 'speaking';

  return {
    // State
    status,
    transcript,
    response,
    interimTranscript,
    language,
    conversationHistory,
    error,

    // Status flags
    isApiConfigured,
    processing,
    listening,
    speaking,

    // Actions
    toggleListening,
    stopAll,
    startNewConversation,
    retryLast,
    setExplicitLanguage,

    // Additional info
    currentStatus: conversationContext.getStatus(),
    summary: conversationContext.getSummary()
  };
}
