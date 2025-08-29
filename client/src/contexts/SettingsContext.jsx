import React, { createContext, useState, useEffect, useMemo } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [includeAdult, setIncludeAdult] = useState(() => {
    const storedValue = localStorage.getItem('cineverse_include_adult');
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem('cineverse_include_adult', JSON.stringify(includeAdult));
  }, [includeAdult]);

  const toggleAdultContent = () => {
    setIncludeAdult((prev) => !prev);
  };

  const value = useMemo(() => ({ includeAdult, toggleAdultContent }), [includeAdult]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
