
import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Separator } from '@/components/ui/separator';
import { defaultYaml } from '@/utils/yamlUtils';

declare global {
  interface Window {
    MonacoEnvironment?: monaco.Environment;
  }
}

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  theme?: string;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, height = "80vh", theme = "vs-light" }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;
    
    window.MonacoEnvironment = {
      getWorkerUrl: function (moduleId: string, label: string) {
        if (label === 'yaml') {
          return './yaml.worker.bundle.js';
        }
        return './editor.worker.bundle.js';
      }
    };

    if (!monaco.languages.getLanguages().some(lang => lang.id === 'yaml')) {
      monaco.languages.register({ id: 'yaml' });
    }

    const editor = monaco.editor.create(editorRef.current, {
      value: value || defaultYaml,
      language: 'yaml',
      automaticLayout: true,
      theme: theme,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineHeight: 22,
      padding: { top: 16, bottom: 16 },
      wordWrap: 'on',
      renderWhitespace: 'boundary',
      cursorBlinking: 'smooth',
      smoothScrolling: true,
      tabSize: 2,
      insertSpaces: true,
      fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
      contextmenu: true,
      folding: true,
      glyphMargin: false,
      roundedSelection: true,
      scrollbar: {
        useShadows: false,
        vertical: 'visible',
        horizontal: 'visible',
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      overviewRulerBorder: false,
    });

    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      onChange(newValue);
    });

    monacoEditorRef.current = editor;
    setIsMounted(true);

    return () => {
      editor.dispose();
    };
  }, [theme]);

  useEffect(() => {
    if (monacoEditorRef.current && isMounted) {
      const currentValue = monacoEditorRef.current.getValue();
      if (value !== currentValue) {
        monacoEditorRef.current.setValue(value);
      }
    }
  }, [value, isMounted]);

  useEffect(() => {
    if (monacoEditorRef.current && isMounted) {
      monaco.editor.setTheme(theme);
    }
  }, [theme, isMounted]);

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden animate-blur-in">
      <div className="flex items-center justify-between p-2 bg-secondary/50 backdrop-blur-sm">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-90"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-90"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-90"></div>
        </div>
        <span className="text-xs text-muted-foreground">YAML Editor</span>
        <div className="w-14"></div>
      </div>
      <Separator />
      {!isMounted ? (
        <div 
          className="w-full flex-1 bg-black flex items-center justify-center" 
          style={{ height }}
        >
          <div className="text-white text-center">
            <div className="animate-pulse mb-2">Loading Editor...</div>
            <div className="text-xs text-gray-400">Please wait while the YAML editor initializes</div>
          </div>
        </div>
      ) : (
        <div 
          ref={editorRef} 
          className="w-full flex-1" 
          style={{ 
            height, 
            overflow: "hidden",
            borderRadius: "0 0 var(--radius) var(--radius)",
            background: "var(--editor-bg)"
          }}
        />
      )}
    </div>
  );
};

export default Editor;
