import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { YamlData, parseYaml, getValueAtPath } from '@/utils/yamlUtils';
import { AnimatePresence, motion } from 'framer-motion';
import { taskTypes, blockTypes } from '@/data/typeDatabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getGradientText, gradients, getGradientTextJSX, getBirdflopGradient } from '@/utils/gradientUtils';
import { EditorSettings } from '@/utils/settingsStorage';
import RewardCustomizer from './RewardCustomizer';
import { Edit, ArrowDown, ArrowUp } from 'lucide-react';
import { toast } from "sonner";

interface YamlFormProps {
  yamlString: string;
  onValueChange: (path: string, value: any) => void;
  useGradientText?: boolean;
  settings?: EditorSettings;
}

const YamlForm: React.FC<YamlFormProps> = ({ 
  yamlString, 
  onValueChange, 
  useGradientText = true,
  settings
}) => {
  const [parsedYaml, setParsedYaml] = useState<YamlData | null>(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [error, setError] = useState<string | null>(null);
  const [gradientPreview, setGradientPreview] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsed = parseYaml(yamlString);
      setParsedYaml(parsed);
      if (parsed.options?.category) {
        setActiveCategory(parsed.options.category);
      }
      setError(null);
    } catch (err) {
      setError("Invalid YAML format");
      console.error(err);
    }
  }, [yamlString]);

  useEffect(() => {
    if (parsedYaml?.display?.name && useGradientText) {
      const fetchGradient = async () => {
        try {
          const cleanName = parsedYaml.display.name.replace(/&[0-9a-fk-or]|&#[0-9a-f]{6}/gi, '');
          const result = await getBirdflopGradient(cleanName);
          setGradientPreview(result);
        } catch (error) {
          console.error("Failed to fetch gradient:", error);
          setGradientPreview("");
        }
      };
      
      fetchGradient();
    }
  }, [parsedYaml?.display?.name, useGradientText]);

  const handleInputChange = (path: string, newValue: any) => {
    if (path === 'tasks.stone.type' || path === 'tasks.stone.block' || path === 'options.category') {
      onValueChange(path, `"${newValue}"`);
      
      if (path === 'tasks.stone.block') {
        onValueChange('display.type', `"${newValue}"`);
      }
    } else {
      onValueChange(path, newValue);
    }
    
    if (path === 'options.category') {
      setActiveCategory(newValue);
    }
  };

  const formatNumber = (value: number): string => {
    if (value >= 86400) {
      const days = Math.floor(value / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (value >= 3600) {
      const hours = Math.floor(value / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else if (value >= 60) {
      const minutes = Math.floor(value / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
    return `${value} ${value === 1 ? 'second' : 'seconds'}`;
  };

  const handleCategorySelect = (category: string) => {
    handleInputChange('options.category', category);
  };

  if (!parsedYaml) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent>
          {error ? 
            <div className="text-destructive">Error: {error}</div> : 
            <div className="text-muted-foreground">Loading...</div>
          }
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-y-auto"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="tasks" className="mt-0">
              <Card className="border-0 shadow-apple-subtle">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-medium">Task Configuration</CardTitle>
                  <CardDescription>
                    Configure the task requirements and conditions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taskType">Task Type</Label>
                      <Select 
                        value={parsedYaml.tasks.stone.type || ''}
                        onValueChange={(value) => handleInputChange('tasks.stone.type', value)}
                      >
                        <SelectTrigger id="taskType" className="w-full">
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Task type determines what the player needs to do
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">
                        Amount 
                        <Badge variant="outline" className="ml-2 text-xs">
                          {parsedYaml.tasks.stone.amount}
                        </Badge>
                      </Label>
                      <Slider 
                        id="amount"
                        min={1}
                        max={100}
                        step={1}
                        value={[parsedYaml.tasks.stone.amount]}
                        onValueChange={(values) => handleInputChange('tasks.stone.amount', values[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="block">Block Type</Label>
                      <Select 
                        value={parsedYaml.tasks.stone.block || ''}
                        onValueChange={(value) => handleInputChange('tasks.stone.block', value)}
                      >
                        <SelectTrigger id="block" className="w-full">
                          <SelectValue placeholder="Select block type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(blockTypes.reduce((acc, block) => {
                            if (!acc[block.category]) acc[block.category] = [];
                            acc[block.category].push(block);
                            return acc;
                          }, {} as Record<string, typeof blockTypes>)).map(([category, blocks]) => (
                            <React.Fragment key={category}>
                              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                {category}
                              </div>
                              {blocks.map((block) => (
                                <SelectItem key={block.id} value={block.id}>
                                  {block.name}
                                </SelectItem>
                              ))}
                              {category !== Object.keys(blockTypes.reduce((acc, block) => {
                                if (!acc[block.category]) acc[block.category] = [];
                                acc[block.category].push(block);
                                return acc;
                              }, {} as Record<string, typeof blockTypes>)).pop() && (
                                <Separator className="my-1" />
                              )}
                            </React.Fragment>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        This will also update the display type
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reverseIfPlaced" className="cursor-pointer">
                        Reverse If Placed
                      </Label>
                      <Switch 
                        id="reverseIfPlaced"
                        checked={parsedYaml.tasks.stone['reverse-if-placed']}
                        onCheckedChange={(checked) => handleInputChange('tasks.stone.reverse-if-placed', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="checkCoreprotect" className="cursor-pointer">
                        Check CoreProtect
                      </Label>
                      <Switch 
                        id="checkCoreprotect"
                        checked={parsedYaml.tasks.stone['check-coreprotect']}
                        onCheckedChange={(checked) => handleInputChange('tasks.stone.check-coreprotect', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="coreprotectTime">
                        CoreProtect Time
                        <Badge variant="outline" className="ml-2 text-xs">
                          {formatNumber(parsedYaml.tasks.stone['check-coreprotect-time'])}
                        </Badge>
                      </Label>
                      <Slider 
                        id="coreprotectTime"
                        min={3600}
                        max={2592000}
                        step={3600}
                        value={[parsedYaml.tasks.stone['check-coreprotect-time']]}
                        onValueChange={(values) => handleInputChange('tasks.stone.check-coreprotect-time', values[0])}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="display" className="mt-0">
              <Card className="border-0 shadow-apple-subtle">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-medium">Display Settings</CardTitle>
                  <CardDescription>
                    Configure how the task appears to players
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      {useGradientText ? (
                        <div className="relative">
                          <Input 
                            id="displayName" 
                            value={parsedYaml.display.name || ''}
                            onChange={(e) => handleInputChange('display.name', e.target.value)}
                            className="input-field"
                          />
                          <div className="mt-2 p-2 border rounded-md bg-background/50">
                            <p className="text-sm text-muted-foreground mb-1">Gradient Preview:</p>
                            <div className={getGradientText("Wood Gathering Task", gradients.wood)}>
                              {parsedYaml.display.name.replace(/&[0-9a-fk-or]|&#[0-9a-f]{6}/gi, '')}
                            </div>
                            
                            {gradientPreview && (
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground mb-1">BirdFlop API Preview:</p>
                                <div className="break-words" dangerouslySetInnerHTML={{ __html: gradientPreview }} />
                              </div>
                            )}
                            
                            <div className="flex justify-end mt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={async () => {
                                  try {
                                    const cleanName = parsedYaml.display.name.replace(/&[0-9a-fk-or]|&#[0-9a-f]{6}/gi, '');
                                    const result = await getBirdflopGradient(cleanName);
                                    handleInputChange('display.name', result);
                                    toast.success('Updated with BirdFlop gradient');
                                  } catch (error) {
                                    console.error(error);
                                    toast.error('Failed to apply gradient');
                                  }
                                }}
                              >
                                Apply BirdFlop Gradient
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Input 
                          id="displayName" 
                          value={parsedYaml.display.name || ''}
                          onChange={(e) => handleInputChange('display.name', e.target.value)}
                          className="input-field"
                        />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="displayType">Display Type</Label>
                      <Select 
                        value={parsedYaml.display.type || ''}
                        onValueChange={(value) => handleInputChange('display.type', value)}
                      >
                        <SelectTrigger id="displayType" className="w-full">
                          <SelectValue placeholder="Select display type" />
                        </SelectTrigger>
                        <SelectContent>
                          {blockTypes.map((block) => (
                            <SelectItem key={block.id} value={block.id}>
                              {block.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        The block icon shown for this task
                      </p>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="space-y-2">
                      <Label htmlFor="loreNormal">Normal Lore</Label>
                      <Textarea 
                        id="loreNormal" 
                        value={parsedYaml.display['lore-normal']?.join('\n') || ''}
                        onChange={(e) => handleInputChange('display.lore-normal', e.target.value.split('\n'))}
                        className="input-field min-h-[100px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loreStarted">Started Lore</Label>
                      <Textarea 
                        id="loreStarted" 
                        value={parsedYaml.display['lore-started']?.join('\n') || ''}
                        onChange={(e) => handleInputChange('display.lore-started', e.target.value.split('\n'))}
                        className="input-field min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="mt-0">
              <Card className="border-0 shadow-apple-subtle">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-medium">Rewards Configuration</CardTitle>
                  <CardDescription>
                    Define rewards for completing the task
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Reward Commands</Label>
                      
                      {Array.isArray(parsedYaml.rewards) && parsedYaml.rewards.map((reward, index) => (
                        <div key={index} className="flex items-center space-x-2 my-2">
                          <RewardCustomizer 
                            rewardString={reward}
                            onChange={(newReward) => {
                              const newRewards = [...(parsedYaml.rewards || [])];
                              newRewards[index] = newReward;
                              handleInputChange('rewards', newRewards);
                            }}
                          />
                          
                          <div className="flex flex-col space-y-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                if (index > 0) {
                                  const newRewards = [...(parsedYaml.rewards || [])];
                                  [newRewards[index], newRewards[index - 1]] = [newRewards[index - 1], newRewards[index]];
                                  handleInputChange('rewards', newRewards);
                                }
                              }}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                if (index < (parsedYaml.rewards || []).length - 1) {
                                  const newRewards = [...(parsedYaml.rewards || [])];
                                  [newRewards[index], newRewards[index + 1]] = [newRewards[index + 1], newRewards[index]];
                                  handleInputChange('rewards', newRewards);
                                }
                              }}
                              disabled={index === (parsedYaml.rewards || []).length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                          const newRewards = [...(parsedYaml.rewards || []), 'eco give {player} 100'];
                          handleInputChange('rewards', newRewards);
                        }}
                      >
                        Add Reward
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rewardMessages">Reward Messages</Label>
                      <Textarea 
                        id="rewardMessages" 
                        value={Array.isArray(parsedYaml.rewardstring) ? parsedYaml.rewardstring.join('\n') : ''}
                        onChange={(e) => handleInputChange('rewardstring', e.target.value.split('\n'))}
                        className="input-field min-h-[100px]"
                        placeholder="Enter each reward message on a new line"
                      />
                      {useGradientText && Array.isArray(parsedYaml.rewardstring) && parsedYaml.rewardstring.length > 0 && (
                        <div className="mt-2 p-2 border rounded-md bg-background/50">
                          <p className="text-sm text-muted-foreground mb-1">Preview:</p>
                          <div className={getGradientText("Task completed!", gradients.blue)}>
                            {parsedYaml.rewardstring[0].replace(/&[0-9a-fk-or]|&#[0-9a-f]{6}/gi, '')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="options" className="mt-0">
              <Card className="border-0 shadow-apple-subtle">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-medium">Task Options</CardTitle>
                  <CardDescription>
                    Configure general task options and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      {settings?.categories && settings.categories.length > 0 ? (
                        <div className="space-y-4">
                          <Select 
                            value={parsedYaml.options?.category || ''}
                            onValueChange={(value) => handleInputChange('options.category', value)}
                          >
                            <SelectTrigger id="category" className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {settings.categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            Categories can be managed in Settings → Advanced
                          </p>
                        </div>
                      ) : (
                        <Input 
                          id="category" 
                          value={parsedYaml.options?.category || ''}
                          onChange={(e) => handleInputChange('options.category', e.target.value)}
                          className="input-field"
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="repeatable" className="cursor-pointer">
                        Repeatable
                      </Label>
                      <Switch 
                        id="repeatable"
                        checked={parsedYaml.options?.repeatable || false}
                        onCheckedChange={(checked) => handleInputChange('options.repeatable', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cooldownEnabled" className="cursor-pointer">
                        Cooldown Enabled
                      </Label>
                      <Switch 
                        id="cooldownEnabled"
                        checked={parsedYaml.options?.cooldown?.enabled || false}
                        onCheckedChange={(checked) => handleInputChange('options.cooldown.enabled', checked)}
                      />
                    </div>
                    
                    {parsedYaml.options?.cooldown?.enabled && (
                      <div className="space-y-2">
                        <Label htmlFor="cooldownTime">
                          Cooldown Time (minutes)
                          <Badge variant="outline" className="ml-2 text-xs">
                            {parsedYaml.options?.cooldown?.time || 0} min
                          </Badge>
                        </Label>
                        <Slider 
                          id="cooldownTime"
                          min={60}
                          max={10080}
                          step={60}
                          value={[parsedYaml.options?.cooldown?.time || 1440]}
                          onValueChange={(values) => handleInputChange('options.cooldown.time', values[0])}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="sortOrder">Sort Order</Label>
                      {settings?.useNumberInputForSort ? (
                        <Input
                          id="sortOrder"
                          type="number"
                          min={1}
                          max={100}
                          value={parsedYaml.options?.['sort-order'] || 1}
                          onChange={(e) => handleInputChange('options.sort-order', parseInt(e.target.value) || 1)}
                          className="input-field"
                        />
                      ) : (
                        <>
                          <Badge variant="outline" className="mb-2 ml-1 text-xs">
                            {parsedYaml.options?.['sort-order'] || 1}
                          </Badge>
                          <Slider 
                            id="sortOrder"
                            min={1}
                            max={100}
                            step={1}
                            value={[parsedYaml.options?.['sort-order'] || 1]}
                            onValueChange={(values) => handleInputChange('options.sort-order', values[0])}
                          />
                        </>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Controls the order tasks appear in the menu
                      </p>
                    </div>
                    
                    {settings?.saveFilenamePatternsEnabled && (
                      <div className="mt-4 p-3 border rounded-md bg-muted/30">
                        <h3 className="text-sm font-medium mb-2">Suggested Filename</h3>
                        <p className="text-xs text-muted-foreground mb-1">
                          Based on your task configuration:
                        </p>
                        <Badge className="text-xs">
                          {
                            `${parsedYaml.options?.category?.[0] || 'T'}${parsedYaml.options?.['sort-order'] || 1}_${parsedYaml.display?.type || 'task'}.yaml`
                          }
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default YamlForm;
