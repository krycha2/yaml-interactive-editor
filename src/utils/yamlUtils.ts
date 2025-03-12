
import yaml from 'js-yaml';

// Types for YAML data
export interface YamlTask {
  type: string;
  amount: number;
  block: string;
  'reverse-if-placed': boolean;
  'check-coreprotect': boolean;
  'check-coreprotect-time': number;
}

export interface YamlDisplay {
  name: string;
  'lore-normal': string[];
  'lore-started': string[];
  type: string;
}

export interface YamlRewards {
  rewards: string[];
  rewardstring: string[];
}

export interface YamlOptions {
  category: string;
  requires: any;
  repeatable: boolean;
  cooldown: {
    enabled: boolean;
    time: number;
  };
  'sort-order': number;
}

export interface YamlData {
  tasks: {
    stone: YamlTask;
  };
  display: YamlDisplay;
  rewards: string[];
  rewardstring: string[];
  placeholders: {
    description: string;
    progress: string;
  };
  options: YamlOptions;
}

// Parse YAML string to object
export function parseYaml(yamlString: string): YamlData {
  try {
    return yaml.load(yamlString) as YamlData;
  } catch (error) {
    console.error('Error parsing YAML:', error);
    throw error;
  }
}

// Convert object to YAML string
export function stringifyYaml(data: YamlData): string {
  try {
    return yaml.dump(data, {
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
    });
  } catch (error) {
    console.error('Error stringifying YAML:', error);
    throw error;
  }
}

// Extract specific values from YAML string
export function extractValuesFromYaml(yamlString: string): Partial<YamlData> {
  try {
    const data = parseYaml(yamlString);
    return {
      tasks: data.tasks,
      options: data.options,
      display: {
        name: data.display.name,
        type: data.display.type,
      },
    };
  } catch (error) {
    console.error('Error extracting values from YAML:', error);
    return {};
  }
}

// Update a specific value in the YAML
export function updateYamlValue(yamlString: string, path: string, value: any): string {
  try {
    const data = parseYaml(yamlString);
    const pathParts = path.split('.');
    
    let current: any = data;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = value;
    
    return stringifyYaml(data);
  } catch (error) {
    console.error('Error updating YAML value:', error);
    return yamlString;
  }
}

// Helper to get the value at a specific path
export function getValueAtPath(obj: any, path: string): any {
  const pathParts = path.split('.');
  
  let current = obj;
  for (const part of pathParts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }
  
  return current;
}

// Default YAML template
export const defaultYaml = `tasks:
  stone:
    type: "blockbreakcertain"
    amount: 64
    block: OAK_LOG
    reverse-if-placed: false
    check-coreprotect: true
    check-coreprotect-time: 604800

display:
  name: "&#5c482c&lD&#644f31&lę&#6d5635&lb&#755d3a&lo&#7d643f&lw&#866b44&le &#8e7248&lP&#97794d&ln&#9f8052&li&#a78757&le &#b08e5b&l#&#b89560&l1"
  lore-normal:
    - "&fZetnij 64 debowe pnie."
    - ""
    - "&7Pamiętaj, że bloki potrzebne do wykonania"
    - "&7zadania muszą być &fNaturalnie Wygenerowane."
    - ""
    - "&#5c482cW &#614d2ft&#675132y&#6c5635m &#725a38z&#775f3ba&#7c633ed&#826841a&#876c44n&#8d7148i&#92754bu &#987a4em&#9d7e51u&#a28354s&#a88757i&#ad8c5as&#b3905dz&#b89560:"
    - "&7▶ Ściąć 64 dębowe pnie."
    - ""
    - "&#5c482cN&#695333a&#765e3bg&#836942r&#91744ao&#9e7f51d&#ab8a59a&#b89560:"
    - "&7▶ 150$"
  lore-started:
    - ""
    - "&#5c482cP&#6b5535o&#7b623ds&#8a6f46t&#997b4fę&#a98857p&#b89560:"
    - "&7▶ &f{stone:progress}&7/64 wykopanych bloków."
  type: "OAK_LOG"

rewards:
  - "eco give {player} 150"
rewardstring:
  - "&7&lUkończyłeś zadanie &#5c482c&lD&#644f31&lę&#6d5635&lb&#755d3a&lo&#7d643f&lw&#866b44&le &#8e7248&lP&#97794d&ln&#9f8052&li&#a78757&le &#b08e5b&l#&#b89560&l1. Gratulacje"

placeholders:
  description: ""
  progress: ""

options:
  category: "Drwala"
  requires:
  repeatable: false
  cooldown:
    enabled: true
    time: 1440
  sort-order: 1`;
