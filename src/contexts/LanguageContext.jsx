import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  const [translations, setTranslations] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);
  const [translationError, setTranslationError] = useState(null);

  const loadTranslations = useCallback(async (lang) => {
    setLoadingTranslations(true);
    setTranslationError(null);
    try {
      const response = await fetch(`/src/locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${lang}`);
      }
      const data = await response.json();
      setTranslations(data);
      localStorage.setItem('language', lang);
    } catch (err) {
      console.error("Error loading translations:", err);
      setTranslationError(err.message);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        const enResponse = await fetch('/src/locales/en.json');
        const enData = await enResponse.json();
        setTranslations(enData);
        localStorage.setItem('language', 'en');
        setCurrentLanguage('en');
      }
    } finally {
      setLoadingTranslations(false);
    }
  }, []);

  useEffect(() => {
    loadTranslations(currentLanguage);
  }, [currentLanguage, loadTranslations]);

  const setLanguage = (lang) => {
    setCurrentLanguage(lang);
  };

  const t = useCallback((key, replacements = {}) => {
    let text = translations;
    const path = key.split('.');
    for (const p of path) {
      if (text && typeof text === 'object' && p in text) {
        text = text[p];
      } else {
        console.warn(`Translation key "${key}" not found. Falling back to key.`);
        return key; // Fallback to key if not found
      }
    }

    if (typeof text !== 'string') {
      console.warn(`Translation for key "${key}" is not a string.`);
      return key;
    }

    // Replace placeholders
    let translatedText = text;
    for (const [placeholder, value] of Object.entries(replacements)) {
      translatedText = translatedText.replace(`{${placeholder}}`, value);
    }

    return translatedText;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, loadingTranslations, translationError }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
