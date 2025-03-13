
export interface EditorSettings {
  darkMode: boolean;
  editorTheme: string;
  gradientTextEnabled: boolean;
  categories: string[];
  useNumberInputForSort: boolean;
  defaultTaskPrefix: string;
  saveFilenamePatternsEnabled: boolean;
}

const SETTINGS_KEY = 'yaml-editor-settings';

export const DEFAULT_SETTINGS: EditorSettings = {
  darkMode: false,
  editorTheme: 'vs-light',
  gradientTextEnabled: true,
  categories: ['Drwala', 'Górnika', 'Farmera', 'Łowcy', 'Budowniczego'],
  useNumberInputForSort: false,
  defaultTaskPrefix: '',
  saveFilenamePatternsEnabled: true
};

export const loadSettings = (): EditorSettings => {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: EditorSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const updateSetting = <K extends keyof EditorSettings>(
  key: K, 
  value: EditorSettings[K]
): EditorSettings => {
  const currentSettings = loadSettings();
  const newSettings = { ...currentSettings, [key]: value };
  saveSettings(newSettings);
  return newSettings;
};
