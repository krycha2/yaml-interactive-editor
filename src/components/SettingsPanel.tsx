
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, FileCode, Palette, Info, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export interface ThemeSettings {
  darkMode: boolean;
  editorTheme: string;
  gradientTextEnabled: boolean;
}

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: ThemeSettings;
  onSettingsChange: (settings: ThemeSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  open,
  onOpenChange,
  settings,
  onSettingsChange
}) => {
  const handleThemeChange = (darkMode: boolean) => {
    onSettingsChange({ ...settings, darkMode });
  };

  const handleEditorThemeChange = (editorTheme: string) => {
    onSettingsChange({ ...settings, editorTheme });
  };

  const handleGradientTextChange = (gradientTextEnabled: boolean) => {
    onSettingsChange({ ...settings, gradientTextEnabled });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[475px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette className="w-5 h-5 text-primary" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your YAML editor experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="mt-4">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="appearance">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="editor">
              <FileCode className="w-4 h-4 mr-2" />
              Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="dark-mode" className="flex items-center gap-2">
                    {settings.darkMode ? 
                      <Moon className="w-4 h-4 text-indigo-400" /> : 
                      <Sun className="w-4 h-4 text-amber-500" />
                    }
                    Theme Mode
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {settings.darkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
                <Switch 
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={handleThemeChange}
                />
              </div>

              <Separator />
              
              <div className="space-y-2">
                <Label className="block mb-2">Gradient Text</Label>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">Enable gradient text effects</span>
                    <span className="text-sm text-muted-foreground">
                      For display names and headings
                    </span>
                  </div>
                  <Switch 
                    id="gradient-text"
                    checked={settings.gradientTextEnabled}
                    onCheckedChange={handleGradientTextChange}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="block mb-2">Editor Theme</Label>
                <RadioGroup 
                  value={settings.editorTheme} 
                  onValueChange={handleEditorThemeChange}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vs-light" id="vs-light" />
                      <Label htmlFor="vs-light">Light</Label>
                    </div>
                    <div className="h-6 w-16 bg-white border border-gray-200 rounded"></div>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vs-dark" id="vs-dark" />
                      <Label htmlFor="vs-dark">Dark</Label>
                    </div>
                    <div className="h-6 w-16 bg-gray-800 border border-gray-700 rounded"></div>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hc-black" id="hc-black" />
                      <Label htmlFor="hc-black">High Contrast</Label>
                    </div>
                    <div className="h-6 w-16 bg-black border border-gray-600 rounded"></div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center">
            <Info className="w-4 h-4 text-muted-foreground mr-2" />
            <Badge variant="outline">v1.0.2</Badge>
          </div>
          <Button onClick={() => onOpenChange(false)} className="gap-1">
            <Check className="w-4 h-4" />
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
