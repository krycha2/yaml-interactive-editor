
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import Editor from "@/components/Editor";
import YamlForm from "@/components/YamlForm";
import Header from "@/components/Header";
import SettingsPanel from "@/components/SettingsPanel";
import { defaultYaml, updateYamlValue, parseYaml } from "@/utils/yamlUtils";
import { motion, AnimatePresence } from "framer-motion";
import { loadSettings, saveSettings, EditorSettings } from "@/utils/settingsStorage";

const Index = () => {
  const [yamlContent, setYamlContent] = useState(defaultYaml);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("editor");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings());
  const isMobile = useIsMobile();
  
  // Apply dark mode effect
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);
  
  // Simulate loading time for a smooth entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle value changes from the form
  const handleFormValueChange = (path: string, value: any) => {
    try {
      const newYaml = updateYamlValue(yamlContent, path, value);
      setYamlContent(newYaml);
    } catch (error) {
      console.error("Error updating YAML:", error);
      toast.error("Failed to update YAML");
    }
  };
  
  // Handle export, import and copy operations
  const handleExport = () => {
    try {
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Generate filename based on settings if enabled
      let filename = 'exported-task.yaml';
      if (settings.saveFilenamePatternsEnabled) {
        try {
          const yamlObj = parseYaml(yamlContent);
          const category = yamlObj.options?.category?.replace(/"/g, '') || 'task';
          const sortOrder = yamlObj.options?.['sort-order'] || 1;
          const blockType = yamlObj.display?.type?.replace(/"/g, '') || 'block';
          filename = `${category[0]}${sortOrder}_${blockType}.yaml`.toLowerCase();
        } catch (e) {
          console.error("Error generating filename", e);
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("YAML exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export YAML");
    }
  };
  
  const handleImport = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.yaml,.yml';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setYamlContent(content);
          toast.success("YAML imported successfully");
        };
        reader.onerror = () => {
          toast.error("Failed to read file");
        };
        reader.readAsText(file);
      };
      
      input.click();
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import YAML");
    }
  };
  
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(yamlContent);
      toast.success("YAML copied to clipboard");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy YAML");
    }
  };

  const handleSettingsChange = (newSettings: EditorSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground animate-pulse">Loading editor...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-right" />
      
      <Header 
        onExport={handleExport}
        onImport={handleImport}
        onCopy={handleCopy}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      
      <SettingsPanel 
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
      
      {isMobile ? (
        // Mobile layout with tabs
        <div className="flex flex-col h-screen p-4 space-y-4">
          <div className="flex space-x-2 mb-4">
            <Button 
              variant={activeTab === 'editor' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('editor')}
              className="flex-1"
            >
              Editor
            </Button>
            <Button 
              variant={activeTab === 'form' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('form')}
              className="flex-1"
            >
              Form
            </Button>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'editor' ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="h-[calc(100vh-120px)]"
              >
                <Editor 
                  value={yamlContent} 
                  onChange={setYamlContent}
                  height="calc(100vh - 120px)"
                  theme={settings.darkMode ? 'vs-dark' : settings.editorTheme}
                />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-[calc(100vh-120px)]"
              >
                <ScrollArea className="h-[calc(100vh-120px)] p-1">
                  <YamlForm 
                    yamlString={yamlContent} 
                    onValueChange={handleFormValueChange} 
                    useGradientText={settings.gradientTextEnabled}
                    settings={settings}
                  />
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        // Desktop layout with panels
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[calc(100vh-58px)]"
        >
          <ResizablePanel defaultSize={50} minSize={30} className="p-4">
            <Editor 
              value={yamlContent} 
              onChange={setYamlContent} 
              theme={settings.darkMode ? 'vs-dark' : settings.editorTheme}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30} className="p-4">
            <ScrollArea className="h-[calc(100vh-74px)]">
              <YamlForm 
                yamlString={yamlContent} 
                onValueChange={handleFormValueChange} 
                useGradientText={settings.gradientTextEnabled}
                settings={settings}
              />
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default Index;
