
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Copy, Code2, Settings } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onImport: () => void;
  onCopy: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, onImport, onCopy }) => {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b border-border py-3 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <Code2 className="h-5 w-5 text-primary mr-2" />
            <h1 className="text-lg font-medium">YAML Interactive Editor</h1>
          </div>
          <Badge variant="outline" className="bg-secondary/50">
            v1.0
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onImport}
            className="flex items-center"
          >
            <Upload className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExport}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCopy}
            className="flex items-center"
          >
            <Copy className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            className="bg-appleBlue hover:bg-appleBlue/90 flex items-center"
          >
            <Settings className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
