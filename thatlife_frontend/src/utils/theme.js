// a helper file for accessing the ** light ** and ** dark ** UI themes for the app

export const THEME_KEY = 'theme';

export const getStoredTheme = () => {
   return localStorage.getItem(THEME_KEY) || 'light';
};

export const toggleTheme = () => {
   const currentTheme = getStoredTheme();
   const newTheme = currentTheme === 'light' ? 'dark' : 'light';
   localStorage.setItem(THEME_KEY, newTheme);
   applyTheme(newTheme);
   return newTheme;
};

export const applyTheme = (theme) => {
   localStorage.setItem(THEME_KEY, theme);
   document.documentElement.classList.toggle('dark', theme === 'dark');
};
