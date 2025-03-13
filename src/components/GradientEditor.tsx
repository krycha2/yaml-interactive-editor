
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { HexColorPicker } from 'react-colorful';
import { 
  generateSubtitleGradient, 
  generateGradientHTML, 
  gradientPresets, 
  SubtitleGradientOptions
} from '@/utils/gradientUtils';
import { X, Plus, Save, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface GradientEditorProps {
  initialText?: string;
  onGradientGenerated?: (gradientHtml: React.ReactNode) => void;
  onGradientOptionsChange?: (options: SubtitleGradientOptions) => void;
}

const GradientEditor: React.FC<GradientEditorProps> = ({ 
  initialText = 'Edit this gradient text', 
  onGradientGenerated,
  onGradientOptionsChange
}) => {
  const [text, setText] = useState(initialText);
  const [colors, setColors] = useState<string[]>(['#9b87f5', '#7E69AB']);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [gradientOptions, setGradientOptions] = useState<SubtitleGradientOptions>({
    text: initialText,
    colors: ['#9b87f5', '#7E69AB'],
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    uppercase: false,
    characterSpacing: 0,
    direction: 'horizontal',
  });
  const [preview, setPreview] = useState<React.ReactNode | null>(null);
  const [activeTab, setActiveTab] = useState<string>('colors');
  
  // Generate the gradient preview whenever options change
  useEffect(() => {
    const gradientChars = generateSubtitleGradient({
      ...gradientOptions,
      text: gradientOptions.uppercase 
        ? gradientOptions.text.toUpperCase() 
        : gradientOptions.text
    });
    
    const generatedHTML = generateGradientHTML(gradientChars);
    setPreview(generatedHTML);
    
    if (onGradientGenerated) {
      onGradientGenerated(generatedHTML);
    }
    
    if (onGradientOptionsChange) {
      onGradientOptionsChange(gradientOptions);
    }
  }, [gradientOptions, onGradientGenerated, onGradientOptionsChange]);
  
  // Update text in gradient options
  useEffect(() => {
    setGradientOptions(prev => ({ ...prev, text }));
  }, [text]);
  
  // Update colors in gradient options
  useEffect(() => {
    setGradientOptions(prev => ({ ...prev, colors }));
  }, [colors]);
  
  // Handle color changes
  const handleColorChange = (newColor: string) => {
    const newColors = [...colors];
    newColors[activeColorIndex] = newColor;
    setColors(newColors);
  };
  
  // Add a new color stop to the gradient
  const addColorStop = () => {
    if (colors.length >= 10) {
      toast.warning("Maximum of 10 color stops allowed");
      return;
    }
    
    // Calculate a color in between for the new stop
    const index = Math.max(0, activeColorIndex);
    const nextIndex = Math.min(colors.length - 1, index + 1);
    
    // If they're the same index, just duplicate the color
    const newColor = index === nextIndex 
      ? colors[index] 
      : `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    
    const newColors = [
      ...colors.slice(0, index + 1),
      newColor,
      ...colors.slice(index + 1)
    ];
    
    setColors(newColors);
    setActiveColorIndex(index + 1);
  };
  
  // Remove a color stop from the gradient
  const removeColorStop = (indexToRemove: number) => {
    if (colors.length <= 2) {
      toast.warning("Minimum of 2 color stops required");
      return;
    }
    
    const newColors = colors.filter((_, i) => i !== indexToRemove);
    setColors(newColors);
    
    // Adjust selected index if needed
    if (activeColorIndex >= indexToRemove && activeColorIndex > 0) {
      setActiveColorIndex(activeColorIndex - 1);
    }
  };
  
  // Apply a preset gradient
  const applyPreset = (presetColors: string[]) => {
    setColors(presetColors);
    setActiveColorIndex(0);
  };
  
  // Copy the gradient HTML to clipboard (as a simplified representation)
  const copyGradientToClipboard = () => {
    // For now we'll just copy the text with a note that it's styled
    navigator.clipboard.writeText(`Gradient: "${text}" with ${colors.length} colors`);
    toast.success("Gradient info copied to clipboard");
  };
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-medium">Gradient Text Editor</CardTitle>
        <CardDescription>
          Create beautiful gradient text with custom colors and styling
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Text preview area */}
        <div className="p-4 bg-background/50 rounded-md border min-h-16 flex items-center justify-center text-xl">
          <div style={{ letterSpacing: `${gradientOptions.characterSpacing || 0}px` }}>
            {preview}
          </div>
        </div>
        
        {/* Text input field */}
        <div className="space-y-2">
          <Label htmlFor="gradientText">Text</Label>
          <Input
            id="gradientText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text for gradient"
            className="w-full"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4">
            {/* Color stops section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Color Stops</Label>
                <Button size="sm" variant="outline" onClick={addColorStop}>
                  <Plus className="w-4 h-4 mr-1" /> Add Color
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <div 
                    key={index}
                    className={`relative cursor-pointer rounded-full p-0.5 border-2 transition-all ${
                      index === activeColorIndex ? 'border-primary scale-110' : 'border-transparent'
                    }`}
                    onClick={() => setActiveColorIndex(index)}
                    title={`Color #${index + 1}: ${color}`}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {colors.length > 2 && (
                      <button
                        className="absolute -top-1 -right-1 w-4 h-4 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeColorStop(index);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Color picker */}
            <div className="space-y-2">
              <Label>Edit Color {activeColorIndex + 1}</Label>
              <div className="flex flex-col items-center space-y-2">
                <HexColorPicker 
                  color={colors[activeColorIndex]} 
                  onChange={handleColorChange}
                  className="w-full max-w-xs"
                />
                <Input
                  value={colors[activeColorIndex]}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full max-w-xs text-center"
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Presets */}
            <div className="space-y-2">
              <Label>Gradient Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {gradientPresets.map((preset, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    className="h-10 justify-start px-3"
                    onClick={() => applyPreset(preset.colors)}
                  >
                    <div className="w-6 h-6 mr-2 rounded">
                      <div 
                        className="w-full h-full rounded"
                        style={{
                          background: `linear-gradient(to right, ${preset.colors.join(', ')})`
                        }}
                      />
                    </div>
                    <span>{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="styling" className="space-y-4">
            {/* Font styling options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="bold" className="cursor-pointer">Bold</Label>
                <Switch 
                  id="bold"
                  checked={gradientOptions.bold} 
                  onCheckedChange={(checked) => {
                    setGradientOptions({...gradientOptions, bold: checked});
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="italic" className="cursor-pointer">Italic</Label>
                <Switch 
                  id="italic"
                  checked={gradientOptions.italic} 
                  onCheckedChange={(checked) => {
                    setGradientOptions({...gradientOptions, italic: checked});
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="underline" className="cursor-pointer">Underline</Label>
                <Switch 
                  id="underline"
                  checked={gradientOptions.underline} 
                  onCheckedChange={(checked) => {
                    setGradientOptions({...gradientOptions, underline: checked});
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="strikethrough" className="cursor-pointer">Strikethrough</Label>
                <Switch 
                  id="strikethrough"
                  checked={gradientOptions.strikethrough} 
                  onCheckedChange={(checked) => {
                    setGradientOptions({...gradientOptions, strikethrough: checked});
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="uppercase" className="cursor-pointer">Uppercase</Label>
                <Switch 
                  id="uppercase"
                  checked={gradientOptions.uppercase} 
                  onCheckedChange={(checked) => {
                    setGradientOptions({...gradientOptions, uppercase: checked});
                  }}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Character spacing */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="charSpacing">Character Spacing</Label>
                <span className="text-xs text-muted-foreground">
                  {gradientOptions.characterSpacing || 0}px
                </span>
              </div>
              <Slider
                id="charSpacing"
                min={-2}
                max={10}
                step={0.5}
                value={[gradientOptions.characterSpacing || 0]}
                onValueChange={(value) => {
                  setGradientOptions({...gradientOptions, characterSpacing: value[0]});
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="direction">Gradient Direction</Label>
              <Select 
                value={gradientOptions.direction} 
                onValueChange={(value: 'horizontal' | 'vertical' | 'diagonal') => {
                  setGradientOptions({...gradientOptions, direction: value});
                }}
              >
                <SelectTrigger id="direction">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="diagonal">Diagonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyGradientToClipboard}
          >
            <Copy className="w-4 h-4 mr-1" /> Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradientEditor;
