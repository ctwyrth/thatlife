// Theme helpers — localStorage + html.dark class for Tailwind darkMode: 'class'.
export const THEME_KEY = 'theme'; // storage key; value is 'light' | 'dark'

// Read persisted theme; default light when missing/invalid.
export const getStoredTheme = () => {
   return localStorage.getItem(THEME_KEY) || 'light';
};

// Flip light ↔ dark, persist, update DOM; returns the new theme string.
export const toggleTheme = () => {
   const currentTheme = getStoredTheme();
   const newTheme = currentTheme === 'light' ? 'dark' : 'light';
   applyTheme(newTheme);
   return newTheme;
};

// Sync documentElement class + localStorage to the given theme.
export const applyTheme = (theme) => {
   localStorage.setItem(THEME_KEY, theme);
   document.documentElement.classList.toggle('dark', theme === 'dark');
};
