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

interface YamlFormProps {
  yamlString: string;
  onValueChange: (path: string, value: any) => void;
}

interface YamlDisplay {
  name: string;
  type: string;
  'lore-normal': string[];
  'lore-started': string[];
}

const YamlForm: React.FC<YamlFormProps> = ({ yamlString, onValueChange }) => {
  const [parsedYaml, setParsedYaml] = useState<YamlData | null>(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsed = parseYaml(yamlString);
      setParsedYaml(parsed);
      setError(null);
    } catch (err) {
      setError("Invalid YAML format");
      console.error(err);
    }
  }, [yamlString]);

  const handleInputChange = (path: string, newValue: any) => {
    onValueChange(path, newValue);
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
                      <Input 
                        id="taskType" 
                        value={parsedYaml.tasks.stone.type || ''}
                        onChange={(e) => handleInputChange('tasks.stone.type', e.target.value)}
                        className="input-field"
                      />
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
                      <Input 
                        id="block" 
                        value={parsedYaml.tasks.stone.block || ''}
                        onChange={(e) => handleInputChange('tasks.stone.block', e.target.value)}
                        className="input-field"
                      />
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
                      <Input 
                        id="displayName" 
                        value={parsedYaml?.display?.name || ''}
                        onChange={(e) => handleInputChange('display.name', e.target.value)}
                        className="input-field bg-wood-gradient text-white font-bold"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="displayType">Display Type</Label>
                      <Input 
                        id="displayType" 
                        value={parsedYaml.display.type || ''}
                        onChange={(e) => handleInputChange('display.type', e.target.value)}
                        className="input-field"
                      />
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
                      <Label htmlFor="rewards">Rewards (Commands)</Label>
                      <Textarea 
                        id="rewards" 
                        value={parsedYaml.rewards?.join('\n') || ''}
                        onChange={(e) => handleInputChange('rewards', e.target.value.split('\n'))}
                        className="input-field min-h-[100px]"
                        placeholder="Enter each reward command on a new line"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rewardMessages">Reward Messages</Label>
                      <Textarea 
                        id="rewardMessages" 
                        value={parsedYaml.rewardstring?.join('\n') || ''}
                        onChange={(e) => handleInputChange('rewardstring', e.target.value.split('\n'))}
                        className="input-field min-h-[100px]"
                        placeholder="Enter each reward message on a new line"
                      />
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
                      <Input 
                        id="category" 
                        value={parsedYaml.options?.category || ''}
                        onChange={(e) => handleInputChange('options.category', e.target.value)}
                        className="input-field"
                      />
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
                      <Label htmlFor="sortOrder">
                        Sort Order
                        <Badge variant="outline" className="ml-2 text-xs">
                          {parsedYaml.options?.['sort-order'] || 1}
                        </Badge>
                      </Label>
                      <Slider 
                        id="sortOrder"
                        min={1}
                        max={100}
                        step={1}
                        value={[parsedYaml.options?.['sort-order'] || 1]}
                        onValueChange={(values) => handleInputChange('options.sort-order', values[0])}
                      />
                    </div>
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
