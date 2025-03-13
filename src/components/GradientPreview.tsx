
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, X } from 'lucide-react';
import GradientEditor from './GradientEditor';
import { SubtitleGradientOptions, generateSubtitleGradient, generateGradientHTML } from '@/utils/gradientUtils';

interface GradientPreviewProps {
  text: string;
  initialOptions?: Partial<SubtitleGradientOptions>;
  className?: string;
}

const GradientPreview: React.FC<GradientPreviewProps> = ({ 
  text, 
  initialOptions = {},
  className = ''
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [renderedGradient, setRenderedGradient] = useState<React.ReactNode | null>(null);
  const [options, setOptions] = useState<SubtitleGradientOptions>({
    text,
    colors: ['#9b87f5', '#7E69AB'],
    bold: initialOptions.bold || false,
    italic: initialOptions.italic || false,
    underline: initialOptions.underline || false,
    strikethrough: initialOptions.strikethrough || false,
    ...initialOptions
  });
  
  useEffect(() => {
    // Update text when it changes externally
    setOptions(prev => ({ ...prev, text }));
  }, [text]);
  
  useEffect(() => {
    // Generate the gradient using current options
    const gradientChars = generateSubtitleGradient(options);
    const html = generateGradientHTML(gradientChars);
    setRenderedGradient(html);
  }, [options]);
  
  return (
    <div className={`relative ${className}`}>
      <Card className="overflow-hidden bg-background/50 border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>{renderedGradient}</div>
          <Popover open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[330px] sm:w-[500px] p-0" align="end">
              <div className="p-1">
                <div className="flex justify-between items-center p-2">
                  <div className="text-sm font-medium">Customize Gradient</div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setIsEditorOpen(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <GradientEditor 
                  initialText={text} 
                  onGradientOptionsChange={(newOptions) => setOptions(newOptions)}
                />
              </div>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradientPreview;
