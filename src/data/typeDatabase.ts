
export interface TaskType {
  id: string;
  name: string;
  description: string;
}

export interface BlockType {
  id: string;
  name: string;
  category: string;
  color?: string;
}

export const taskTypes: TaskType[] = [
  {
    id: "blockbreakcertain",
    name: "Block Break Certain",
    description: "Break specific blocks"
  },
  {
    id: "blockplacecertain",
    name: "Block Place Certain",
    description: "Place specific blocks"
  },
  {
    id: "mobkill",
    name: "Mob Kill",
    description: "Kill specific mobs"
  },
  {
    id: "itemcollect",
    name: "Item Collect",
    description: "Collect specific items"
  },
  {
    id: "fishing",
    name: "Fishing",
    description: "Catch specific fish"
  },
  {
    id: "farming",
    name: "Farming",
    description: "Farm specific crops"
  },
  {
    id: "crafting",
    name: "Crafting",
    description: "Craft specific items"
  },
  {
    id: "brewing",
    name: "Brewing",
    description: "Brew specific potions"
  }
];

export const blockTypes: BlockType[] = [
  { id: "OAK_LOG", name: "Oak Log", category: "Wood" },
  { id: "BIRCH_LOG", name: "Birch Log", category: "Wood" },
  { id: "SPRUCE_LOG", name: "Spruce Log", category: "Wood" },
  { id: "JUNGLE_LOG", name: "Jungle Log", category: "Wood" },
  { id: "ACACIA_LOG", name: "Acacia Log", category: "Wood" },
  { id: "DARK_OAK_LOG", name: "Dark Oak Log", category: "Wood" },
  { id: "STONE", name: "Stone", category: "Stone" },
  { id: "COBBLESTONE", name: "Cobblestone", category: "Stone" },
  { id: "GRANITE", name: "Granite", category: "Stone" },
  { id: "DIORITE", name: "Diorite", category: "Stone" },
  { id: "ANDESITE", name: "Andesite", category: "Stone" },
  { id: "DIRT", name: "Dirt", category: "Earth" },
  { id: "GRASS_BLOCK", name: "Grass Block", category: "Earth" },
  { id: "SAND", name: "Sand", category: "Earth" },
  { id: "GRAVEL", name: "Gravel", category: "Earth" },
  { id: "CLAY", name: "Clay", category: "Earth" },
  { id: "COAL_ORE", name: "Coal Ore", category: "Ore" },
  { id: "IRON_ORE", name: "Iron Ore", category: "Ore" },
  { id: "GOLD_ORE", name: "Gold Ore", category: "Ore" },
  { id: "DIAMOND_ORE", name: "Diamond Ore", category: "Ore" },
  { id: "LAPIS_ORE", name: "Lapis Ore", category: "Ore" },
  { id: "REDSTONE_ORE", name: "Redstone Ore", category: "Ore" },
  { id: "EMERALD_ORE", name: "Emerald Ore", category: "Ore" }
];
