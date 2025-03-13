
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface RewardCustomizerProps {
  rewardString: string;
  onChange: (newReward: string) => void;
}

const rewardTemplates = [
  { label: 'Money', value: 'eco give {player} {amount}', placeholders: ['amount'] },
  { label: 'Item', value: 'give {player} {item} {amount}', placeholders: ['item', 'amount'] },
  { label: 'Experience', value: 'xp add {player} {amount} points', placeholders: ['amount'] },
  { label: 'Permission', value: 'lp user {player} permission set {permission} true', placeholders: ['permission'] },
  { label: 'Command', value: '{command}', placeholders: ['command'] },
  { label: 'Custom', value: '', placeholders: [] }
];

const RewardCustomizer: React.FC<RewardCustomizerProps> = ({ rewardString, onChange }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  
  // Find the matching template when component mounts or rewardString changes
  useEffect(() => {
    for (const template of rewardTemplates) {
      let testStr = template.value;
      for (const placeholder of template.placeholders) {
        testStr = testStr.replace(`{${placeholder}}`, '.*');
      }
      const regex = new RegExp(`^${testStr.replace(/\{player\}/g, '\\{player\\}')}$`);
      
      if (regex.test(rewardString) || (!rewardString && template.value === '')) {
        setSelectedTemplate(template.value);
        
        // Extract placeholder values
        if (template.value !== '') {
          const values: Record<string, string> = {};
          for (const placeholder of template.placeholders) {
            // Create regex to extract the value
            const placeholderRegex = new RegExp(
              template.value.replace(`{${placeholder}}`, '(.+)').replace(/\{player\}/g, '\\{player\\}')
            );
            const match = rewardString.match(placeholderRegex);
            if (match && match[1]) {
              values[placeholder] = match[1];
            }
          }
          setPlaceholderValues(values);
        }
        break;
      }
    }
  }, [rewardString]);

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    setPlaceholderValues({});
    
    // Set default values for placeholders
    const template = rewardTemplates.find(t => t.value === value);
    if (template) {
      let newReward = template.value;
      if (template.placeholders.length === 0) {
        onChange(newReward);
      }
    }
  };

  const handlePlaceholderChange = (placeholder: string, value: string) => {
    const newValues = { ...placeholderValues, [placeholder]: value };
    setPlaceholderValues(newValues);
    
    // Update the reward string
    const template = rewardTemplates.find(t => t.value === selectedTemplate);
    if (template) {
      let newReward = template.value;
      for (const [key, val] of Object.entries(newValues)) {
        newReward = newReward.replace(`{${key}}`, val);
      }
      
      // Only trigger onChange if all placeholders have values
      const allPlaceholdersFilled = template.placeholders.every(p => newValues[p] && newValues[p].trim() !== '');
      if (allPlaceholdersFilled) {
        onChange(newReward);
      }
    }
  };

  const templateItem = rewardTemplates.find(t => t.value === selectedTemplate);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Reward Type</Label>
        <Select
          value={selectedTemplate}
          onValueChange={handleTemplateChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a reward type" />
          </SelectTrigger>
          <SelectContent>
            {rewardTemplates.map((template) => (
              <SelectItem key={template.label} value={template.value}>
                {template.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTemplate === '' && (
        <div className="space-y-2">
          <Label htmlFor="customReward">Custom Reward Command</Label>
          <Input
            id="customReward"
            placeholder="Enter custom command"
            value={rewardString}
            onChange={(e) => onChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Use {'{player}'} to reference the player
          </p>
        </div>
      )}

      {templateItem && templateItem.placeholders.length > 0 && (
        <div className="space-y-4">
          {templateItem.placeholders.map((placeholder) => (
            <div key={placeholder} className="space-y-2">
              <Label htmlFor={`placeholder-${placeholder}`}>
                {placeholder.charAt(0).toUpperCase() + placeholder.slice(1)}
              </Label>
              <Input
                id={`placeholder-${placeholder}`}
                placeholder={`Enter ${placeholder}`}
                value={placeholderValues[placeholder] || ''}
                onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Badge variant="outline" className="text-xs">
          {rewardString || 'No reward set'}
        </Badge>
      </div>
    </div>
  );
};

export default RewardCustomizer;
