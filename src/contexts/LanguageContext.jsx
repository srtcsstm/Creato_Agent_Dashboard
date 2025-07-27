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
      const url = `/locales/${lang}/translation.json`;
      console.log(`[LanguageContext] Attempting to load translations from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to load translations for ${lang}. Status: ${response.status}, Response: ${errorText}`);
      }
      
      const data = await response.json();
      setTranslations(data);
      localStorage.setItem('language', lang);
      console.log(`[LanguageContext] Successfully loaded translations for ${lang}.`);
    } catch (err) {
      console.error(`[LanguageContext] Error loading translations for ${lang}:`, err);
      setTranslationError(err.message);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        console.warn(`[LanguageContext] Falling back to English translations due to error for ${lang}.`);
        try {
          const enUrl = '/locales/en/translation.json';
          console.log(`[LanguageContext] Attempting to load English fallback from: ${enUrl}`);
          const enResponse = await fetch(enUrl);
          if (!enResponse.ok) {
            const enErrorText = await enResponse.text();
            throw new Error(`Failed to load English fallback translations. Status: ${enResponse.status}, Response: ${enErrorText}`);
          }
          const enData = await enResponse.json();
          setTranslations(enData);
          localStorage.setItem('language', 'en');
          setCurrentLanguage('en');
          console.log(`[LanguageContext] Successfully loaded English fallback translations.`);
        } catch (enErr) {
          console.error(`[LanguageContext] Critical: Failed to load even English fallback translations:`, enErr);
          setTranslationError(enErr.message);
        }
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
        // console.warn(`[LanguageContext] Translation key "${key}" not found. Falling back to key.`);
        return key; // Fallback to key if not found
      }
    }

    if (typeof text !== 'string') {
      // console.warn(`[LanguageContext] Translation for key "${key}" is not a string.`);
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
