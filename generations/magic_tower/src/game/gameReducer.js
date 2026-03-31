// Game state reducer for Magic Tower
// Manages all game state updates using immutable patterns
// Last modified: Adding hidden wall support

// Tile type constants - must be defined first
export const TILE_TYPES = {
  FLOOR: 0,
  WALL: 1,
  STAIRS_UP: 2,
  STAIRS_DOWN: 3,
  YELLOW_DOOR: 10,
  BLUE_DOOR: 11,
  RED_DOOR: 12,
  YELLOW_KEY: 20,
  BLUE_KEY: 21,
  RED_KEY: 22,
  SMALL_POTION: 30,
  BIG_POTION: 31,
  SUPER_POTION: 32,
  RED_GEM: 40,
  BLUE_GEM: 41,
  GREEN_GEM: 42,
  IRON_SWORD: 50,
  STEEL_SWORD: 51,
  HOLY_SWORD: 52,
  WOODEN_SHIELD: 60,
  IRON_SHIELD: 61,
  HOLY_SHIELD: 62,
  ATTACK_BOOK: 70,
  DEFENSE_BOOK: 71,
  GOLD_PILE: 80,
  BIG_GOLD_PILE: 81,
  GREEN_SLIME: 100,
  RED_BAT: 101,
  SKELETON: 102,
  MAGICIAN: 103,
  RED_SLIME: 110,
  STONE_GOLEM: 111,
  DARK_KNIGHT: 112,
  WITCH: 113,
  VAMPIRE: 120,
  DRAGON: 121,
  DARK_MAGE: 122,
  SKELETON_KING: 123,
  MINI_BOSS: 200,
  FLOOR_GUARDIAN: 201,
  TOWER_LORD: 202,
  NPC: 300,
  SHOPKEEPER: 301,
  HIDDEN_WALL: 400
}

// Monster stats
export const MONSTER_STATS = {
  [TILE_TYPES.GREEN_SLIME]: { name: 'Green Slime', hp: 35, atk: 18, def: 1 },
  [TILE_TYPES.RED_BAT]: { name: 'Red Bat', hp: 45, atk: 20, def: 5 },
  [TILE_TYPES.SKELETON]: { name: 'Skeleton', hp: 50, atk: 22, def: 8 },
  [TILE_TYPES.MAGICIAN]: { name: 'Magician', hp: 40, atk: 25, def: 3 },
  [TILE_TYPES.RED_SLIME]: { name: 'Red Slime', hp: 70, atk: 30, def: 10 },
  [TILE_TYPES.STONE_GOLEM]: { name: 'Stone Golem', hp: 100, atk: 35, def: 20 },
  [TILE_TYPES.DARK_KNIGHT]: { name: 'Dark Knight', hp: 120, atk: 40, def: 25 },
  [TILE_TYPES.WITCH]: { name: 'Witch', hp: 80, atk: 45, def: 15 },
  [TILE_TYPES.VAMPIRE]: { name: 'Vampire', hp: 200, atk: 55, def: 30 },
  [TILE_TYPES.DRAGON]: { name: 'Dragon', hp: 300, atk: 60, def: 40 },
  [TILE_TYPES.DARK_MAGE]: { name: 'Dark Mage', hp: 250, atk: 70, def: 35 },
  [TILE_TYPES.SKELETON_KING]: { name: 'Skeleton King', hp: 350, atk: 65, def: 45 },
  [TILE_TYPES.MINI_BOSS]: { name: 'Mini Boss', hp: 500, atk: 80, def: 50 },
  [TILE_TYPES.FLOOR_GUARDIAN]: { name: 'Floor Guardian', hp: 800, atk: 100, def: 60 },
  [TILE_TYPES.TOWER_LORD]: { name: 'Tower Lord', hp: 1500, atk: 120, def: 80 }
}

// Equipment stat bonuses
export const EQUIPMENT_STATS = {
  [TILE_TYPES.IRON_SWORD]: { name: 'Iron Sword', type: 'sword', atk: 10 },
  [TILE_TYPES.STEEL_SWORD]: { name: 'Steel Sword', type: 'sword', atk: 20 },
  [TILE_TYPES.HOLY_SWORD]: { name: 'Holy Sword', type: 'sword', atk: 50 },
  [TILE_TYPES.WOODEN_SHIELD]: { name: 'Wooden Shield', type: 'shield', def: 8 },
  [TILE_TYPES.IRON_SHIELD]: { name: 'Iron Shield', type: 'shield', def: 15 },
  [TILE_TYPES.HOLY_SHIELD]: { name: 'Holy Shield', type: 'shield', def: 40 },
  [TILE_TYPES.ATTACK_BOOK]: { name: 'Attack Book', type: 'book', atk: 3 },
  [TILE_TYPES.DEFENSE_BOOK]: { name: 'Defense Book', type: 'book', def: 3 }
}

// Calculate effective player stats (base + equipment bonuses)
function getEffectivePlayerStats(player, equipment) {
  let effectiveAtk = player.atk
  let effectiveDef = player.def

  // Add sword bonus
  if (equipment.sword) {
    const swordStats = EQUIPMENT_STATS[equipment.sword]
    if (swordStats && swordStats.atk) {
      effectiveAtk += swordStats.atk
    }
  }

  // Add shield bonus
  if (equipment.shield) {
    const shieldStats = EQUIPMENT_STATS[equipment.shield]
    if (shieldStats && shieldStats.def) {
      effectiveDef += shieldStats.def
    }
  }

  return { atk: effectiveAtk, def: effectiveDef }
}

function getDoorTypeName(doorType) {
  switch (doorType) {
    case TILE_TYPES.YELLOW_DOOR:
      return 'yellowDoor'
    case TILE_TYPES.BLUE_DOOR:
      return 'blueDoor'
    case TILE_TYPES.RED_DOOR:
      return 'redDoor'
    default:
      return 'yellowDoor'
  }
}

// Create Floor 0 - Ground Floor (Introduction Floor)
// Per specification: 3 Green Slimes, 2 Red Bats, 2 Yellow Keys, 1 Yellow Door,
// 2 Small Potions, 1 Red Gem, stairs up, NPC guide
function createTestFloor() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add some internal walls for structure
  map[3][3] = TILE_TYPES.WALL
  map[3][4] = TILE_TYPES.WALL
  map[3][5] = TILE_TYPES.HIDDEN_WALL  // Hidden wall for testing - adjacent to player start
  map[7][3] = TILE_TYPES.WALL
  map[7][4] = TILE_TYPES.WALL
  map[7][5] = TILE_TYPES.WALL

  // Player starting area (center: 5,5) - open space
  // Hidden wall at (3,5) is 2 tiles above player at (5,5)

  // Yellow Keys (2 total)
  map[2][7] = TILE_TYPES.YELLOW_KEY  // Top right area
  map[8][3] = TILE_TYPES.YELLOW_KEY  // Bottom left area

  // Yellow Door (1 total) - guards access to stairs
  map[5][8] = TILE_TYPES.YELLOW_DOOR

  // Small Potions (2 total)
  map[2][2] = TILE_TYPES.SMALL_POTION  // Top left corner
  map[8][8] = TILE_TYPES.SMALL_POTION  // Bottom right area

  // Red Gem (1 total) - reward for exploration
  map[1][9] = TILE_TYPES.RED_GEM

  // Green Slimes (3 total) - easy monsters
  map[2][5] = TILE_TYPES.GREEN_SLIME
  map[8][5] = TILE_TYPES.GREEN_SLIME
  map[5][2] = TILE_TYPES.GREEN_SLIME

  // Red Bats (2 total) - slightly harder
  map[2][8] = TILE_TYPES.RED_BAT
  map[8][2] = TILE_TYPES.RED_BAT

  // Stairs up to Floor 1
  map[5][9] = TILE_TYPES.STAIRS_UP

  // NPC Guide - gives basic instructions
  map[4][5] = TILE_TYPES.NPC

  return map
}

// Create Floor 1 - Slightly harder, introduces blue keys/doors
// Per specification: 2 Green Slimes, 2 Red Bats, 1 Skeleton,
// 2 Yellow Keys, 1 Blue Key, 1 Yellow Door, 1 Blue Door,
// 2 Small Potions, 1 Blue Gem, 1 Gold Pile, stairs up and down
function createFloor1() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add internal walls for structure
  map[2][4] = TILE_TYPES.WALL
  map[2][5] = TILE_TYPES.WALL
  map[2][6] = TILE_TYPES.WALL
  map[8][4] = TILE_TYPES.WALL
  map[8][5] = TILE_TYPES.WALL
  map[8][6] = TILE_TYPES.WALL
  map[4][2] = TILE_TYPES.WALL
  map[5][2] = TILE_TYPES.WALL
  map[6][2] = TILE_TYPES.WALL

  // Stairs
  map[5][1] = TILE_TYPES.STAIRS_DOWN  // Back to Floor 0
  map[5][9] = TILE_TYPES.STAIRS_UP    // Up to Floor 2

  // Yellow Keys (2 total)
  map[1][5] = TILE_TYPES.YELLOW_KEY
  map[9][5] = TILE_TYPES.YELLOW_KEY

  // Blue Key (1 total) - introduces blue doors
  map[1][8] = TILE_TYPES.BLUE_KEY

  // Yellow Door (1 total)
  map[5][3] = TILE_TYPES.YELLOW_DOOR

  // Blue Door (1 total) - requires blue key
  map[5][7] = TILE_TYPES.BLUE_DOOR

  // Small Potions (2 total)
  map[1][1] = TILE_TYPES.SMALL_POTION
  map[9][9] = TILE_TYPES.SMALL_POTION

  // Blue Gem (1 total) - defense upgrade
  map[9][1] = TILE_TYPES.BLUE_GEM

  // Gold Pile (1 total)
  map[1][3] = TILE_TYPES.GOLD_PILE

  // Green Slimes (2 total) - easy monsters
  map[3][7] = TILE_TYPES.GREEN_SLIME
  map[7][3] = TILE_TYPES.GREEN_SLIME

  // Red Bats (2 total) - slightly harder
  map[3][3] = TILE_TYPES.RED_BAT
  map[7][7] = TILE_TYPES.RED_BAT

  // Skeleton (1 total) - medium difficulty
  map[5][5] = TILE_TYPES.SKELETON

  return map
}

// Create Floor 2 - Medium difficulty, more complex door puzzles
// Per specification: 1 Red Bat, 2 Skeletons, 1 Magician,
// 2 Yellow Keys, 1 Blue Key, 2 Yellow Doors, 1 Blue Door,
// 1 Small Potion, 1 Big Potion, 1 Green Gem, stairs up and down
function createFloor2() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add internal walls for structure - more complex layout
  // Top section walls
  map[2][2] = TILE_TYPES.WALL
  map[2][3] = TILE_TYPES.WALL
  map[2][4] = TILE_TYPES.WALL
  map[2][6] = TILE_TYPES.WALL
  map[2][7] = TILE_TYPES.WALL
  map[2][8] = TILE_TYPES.WALL

  // Middle section walls - with opening for player passage
  map[4][4] = TILE_TYPES.WALL
  map[4][5] = TILE_TYPES.WALL
  map[4][6] = TILE_TYPES.WALL
  // map[5][4] removed - clear path for player to stairs
  map[5][6] = TILE_TYPES.WALL
  map[6][4] = TILE_TYPES.WALL
  map[6][5] = TILE_TYPES.WALL
  map[6][6] = TILE_TYPES.WALL
  // Note: row 5, col 4 left open for player passage to stairs

  // Bottom section walls
  map[8][2] = TILE_TYPES.WALL
  map[8][3] = TILE_TYPES.WALL
  map[8][4] = TILE_TYPES.WALL
  map[8][6] = TILE_TYPES.WALL
  map[8][7] = TILE_TYPES.WALL
  map[8][8] = TILE_TYPES.WALL

  // Stairs
  map[5][1] = TILE_TYPES.STAIRS_DOWN  // Back to Floor 1
  map[5][9] = TILE_TYPES.STAIRS_UP    // Up to Floor 3

  // Yellow Keys (2 total) - scattered around
  map[1][7] = TILE_TYPES.YELLOW_KEY
  map[9][2] = TILE_TYPES.YELLOW_KEY

  // Blue Key (1 total) - rewards exploration
  map[1][8] = TILE_TYPES.BLUE_KEY

  // Yellow Doors (2 total) - creates puzzle paths
  map[3][2] = TILE_TYPES.YELLOW_DOOR
  map[7][7] = TILE_TYPES.YELLOW_DOOR

  // Blue Door (1 total) - guards central area (not at player start)
  map[5][6] = TILE_TYPES.BLUE_DOOR

  // Small Potion (1 total)
  map[1][5] = TILE_TYPES.SMALL_POTION

  // Big Potion (1 total) - better healing
  map[9][5] = TILE_TYPES.BIG_POTION

  // Green Gem (1 total) - +1 ATK and +1 DEF
  map[5][7] = TILE_TYPES.GREEN_GEM

  // Red Bat (1 total) - easy monster
  map[1][1] = TILE_TYPES.RED_BAT

  // Skeletons (2 total) - medium difficulty
  map[3][4] = TILE_TYPES.SKELETON
  map[7][4] = TILE_TYPES.SKELETON

  // Magician (1 total) - harder monster
  map[9][1] = TILE_TYPES.MAGICIAN

  return map
}

// Create Floor 3 - Shop Floor (Introduction to Shop System)
// Per specification: 1 Shopkeeper NPC, 2 Green Slimes, 1 Yellow Key,
// 2 Gold Piles, stairs up and down
function createFloor3() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add internal walls for structure - simple layout for shop floor
  // Create a central shop area
  map[4][4] = TILE_TYPES.WALL
  map[4][5] = TILE_TYPES.WALL
  map[4][6] = TILE_TYPES.WALL
  map[6][4] = TILE_TYPES.WALL
  map[6][5] = TILE_TYPES.WALL
  map[6][6] = TILE_TYPES.WALL

  // Leave openings at (5,4) and (5,6) for shop access

  // Stairs
  map[5][1] = TILE_TYPES.STAIRS_DOWN  // Back to Floor 2
  map[5][9] = TILE_TYPES.STAIRS_UP    // Up to Floor 4

  // Shopkeeper NPC - in center of shop area
  map[5][5] = TILE_TYPES.SHOPKEEPER

  // Yellow Key (1 total) - purchase or find
  map[1][5] = TILE_TYPES.YELLOW_KEY

  // Gold Piles (2 total) - for shopping
  map[1][1] = TILE_TYPES.GOLD_PILE
  map[9][9] = TILE_TYPES.GOLD_PILE

  // Green Slimes (2 total) - easy monsters guarding areas
  map[1][8] = TILE_TYPES.GREEN_SLIME
  map[9][2] = TILE_TYPES.GREEN_SLIME

  return map
}

// Create Floor 4 - Introduces red keys/doors and stronger monsters
// Per specification: 2 Skeletons, 1 Red Slime, 1 Stone Golem,
// 2 Yellow Keys, 1 Blue Key, 1 Red Key, 2 Yellow Doors, 1 Blue Door, 1 Red Door,
// 1 Big Potion, 1 Blue Gem, 1 Iron Sword, stairs up and down
function createFloor4() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add internal walls - complex layout with red door as main barrier
  map[2][3] = TILE_TYPES.WALL
  map[2][4] = TILE_TYPES.WALL
  map[2][5] = TILE_TYPES.WALL
  map[2][6] = TILE_TYPES.WALL
  map[2][7] = TILE_TYPES.WALL
  map[8][3] = TILE_TYPES.WALL
  map[8][4] = TILE_TYPES.WALL
  map[8][5] = TILE_TYPES.WALL
  map[8][6] = TILE_TYPES.WALL
  map[8][7] = TILE_TYPES.WALL
  map[4][2] = TILE_TYPES.WALL
  map[5][2] = TILE_TYPES.WALL
  map[6][2] = TILE_TYPES.WALL
  map[4][8] = TILE_TYPES.WALL
  map[5][8] = TILE_TYPES.WALL
  map[6][8] = TILE_TYPES.WALL

  // Stairs
  map[5][1] = TILE_TYPES.STAIRS_DOWN  // Back to Floor 3
  map[5][9] = TILE_TYPES.STAIRS_UP    // Up to Floor 5

  // Yellow Keys (2 total)
  map[1][5] = TILE_TYPES.YELLOW_KEY
  map[9][5] = TILE_TYPES.YELLOW_KEY

  // Blue Key (1 total)
  map[1][8] = TILE_TYPES.BLUE_KEY

  // Red Key (1 total) - introduces red doors
  map[9][2] = TILE_TYPES.RED_KEY

  // Yellow Doors (2 total)
  map[3][2] = TILE_TYPES.YELLOW_DOOR
  map[7][8] = TILE_TYPES.YELLOW_DOOR

  // Blue Door (1 total)
  map[5][4] = TILE_TYPES.BLUE_DOOR

  // Red Door (1 total) - guards valuable items
  map[5][6] = TILE_TYPES.RED_DOOR

  // Big Potion (1 total)
  map[1][1] = TILE_TYPES.BIG_POTION

  // Blue Gem (1 total) - defense upgrade
  map[9][9] = TILE_TYPES.BLUE_GEM

  // Iron Sword (1 total) - weapon upgrade (+10 ATK)
  map[5][7] = TILE_TYPES.IRON_SWORD

  // Skeletons (2 total) - medium difficulty monsters
  map[3][4] = TILE_TYPES.SKELETON
  map[7][6] = TILE_TYPES.SKELETON

  // Red Slime (1 total) - harder monster
  map[3][7] = TILE_TYPES.RED_SLIME

  // Stone Golem (1 total) - tough monster
  map[7][3] = TILE_TYPES.STONE_GOLEM

  return map
}

// Create Floor 5 - Harder combat encounters, strategic key usage
// Per specification: 1 Stone Golem, 2 Dark Knights, 1 Witch,
// 1 Yellow Key, 1 Blue Key, 1 Red Key, 2 Yellow Doors, 1 Blue Door, 1 Red Door,
// 1 Big Potion, 1 Green Gem, 1 Wooden Shield, stairs up and down
function createFloor5() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add internal walls - maze-like structure
  map[3][3] = TILE_TYPES.WALL
  map[3][4] = TILE_TYPES.WALL
  map[3][5] = TILE_TYPES.WALL
  map[3][6] = TILE_TYPES.WALL
  map[3][7] = TILE_TYPES.WALL
  map[7][3] = TILE_TYPES.WALL
  map[7][4] = TILE_TYPES.WALL
  map[7][5] = TILE_TYPES.WALL
  map[7][6] = TILE_TYPES.WALL
  map[7][7] = TILE_TYPES.WALL
  map[4][2] = TILE_TYPES.WALL
  map[5][2] = TILE_TYPES.WALL
  map[6][2] = TILE_TYPES.WALL
  map[4][8] = TILE_TYPES.WALL
  map[5][8] = TILE_TYPES.WALL
  map[6][8] = TILE_TYPES.WALL

  // Stairs
  map[5][1] = TILE_TYPES.STAIRS_DOWN  // Back to Floor 4
  map[5][9] = TILE_TYPES.STAIRS_UP    // Up to Floor 6

  // Yellow Key (1 total)
  map[1][5] = TILE_TYPES.YELLOW_KEY

  // Blue Key (1 total)
  map[9][5] = TILE_TYPES.BLUE_KEY

  // Red Key (1 total)
  map[5][5] = TILE_TYPES.RED_KEY

  // Yellow Doors (2 total)
  map[3][2] = TILE_TYPES.YELLOW_DOOR
  map[7][8] = TILE_TYPES.YELLOW_DOOR

  // Blue Door (1 total)
  map[4][5] = TILE_TYPES.BLUE_DOOR

  // Red Door (1 total)
  map[6][5] = TILE_TYPES.RED_DOOR

  // Big Potion (1 total)
  map[1][1] = TILE_TYPES.BIG_POTION

  // Green Gem (1 total) - +1 ATK and +1 DEF
  map[9][9] = TILE_TYPES.GREEN_GEM

  // Wooden Shield (1 total) - defense upgrade (+8 DEF)
  map[1][9] = TILE_TYPES.WOODEN_SHIELD

  // Stone Golem (1 total) - tough monster
  map[3][4] = TILE_TYPES.STONE_GOLEM

  // Dark Knights (2 total) - hard monsters
  map[7][6] = TILE_TYPES.DARK_KNIGHT
  map[5][7] = TILE_TYPES.DARK_KNIGHT

  // Witch (1 total) - magical attacker
  map[7][4] = TILE_TYPES.WITCH

  return map
}

// Create Floor 6 - Complex puzzle with hidden walls and strategic routing
// Per specification: 2 Dark Knights, 2 Witches, 1 Red Slime,
// 2 Yellow Keys, 2 Blue Keys, 1 Red Key, 3 Yellow Doors, 2 Blue Doors, 1 Red Door,
// 1 Super Potion, 1 Attack Book, stairs up and down
// Has 2 hidden walls that reveal shortcuts
function createFloor6() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add internal walls - complex puzzle layout
  map[2][2] = TILE_TYPES.WALL
  map[2][3] = TILE_TYPES.WALL
  map[2][4] = TILE_TYPES.WALL
  map[2][5] = TILE_TYPES.WALL
  map[2][6] = TILE_TYPES.WALL
  map[2][7] = TILE_TYPES.WALL
  map[8][2] = TILE_TYPES.WALL
  map[8][3] = TILE_TYPES.WALL
  map[8][4] = TILE_TYPES.WALL
  map[8][5] = TILE_TYPES.WALL
  map[8][6] = TILE_TYPES.WALL
  map[8][7] = TILE_TYPES.WALL
  map[4][3] = TILE_TYPES.WALL
  map[5][3] = TILE_TYPES.WALL
  map[6][3] = TILE_TYPES.WALL
  map[4][7] = TILE_TYPES.WALL
  map[5][7] = TILE_TYPES.WALL
  map[6][7] = TILE_TYPES.WALL

  // Hidden walls - these look like walls but are passable when revealed
  map[3][5] = TILE_TYPES.HIDDEN_WALL  // Hidden wall at (3,5)
  map[7][5] = TILE_TYPES.HIDDEN_WALL  // Hidden wall at (7,5)

  // Stairs
  map[5][1] = TILE_TYPES.STAIRS_DOWN  // Back to Floor 5
  map[5][9] = TILE_TYPES.STAIRS_UP    // Up to Floor 7

  // Yellow Keys (2 total)
  map[1][5] = TILE_TYPES.YELLOW_KEY
  map[9][5] = TILE_TYPES.YELLOW_KEY

  // Blue Keys (2 total)
  map[1][8] = TILE_TYPES.BLUE_KEY
  map[9][2] = TILE_TYPES.BLUE_KEY

  // Red Key (1 total)
  map[5][5] = TILE_TYPES.RED_KEY

  // Yellow Doors (3 total)
  map[3][2] = TILE_TYPES.YELLOW_DOOR
  map[7][2] = TILE_TYPES.YELLOW_DOOR
  map[5][4] = TILE_TYPES.YELLOW_DOOR

  // Blue Doors (2 total)
  map[3][8] = TILE_TYPES.BLUE_DOOR
  map[7][8] = TILE_TYPES.BLUE_DOOR

  // Red Door (1 total)
  map[5][6] = TILE_TYPES.RED_DOOR

  // Super Potion (1 total) - full heal
  map[1][1] = TILE_TYPES.SUPER_POTION

  // Attack Book (1 total) - permanent ATK upgrade
  map[9][9] = TILE_TYPES.ATTACK_BOOK

  // Dark Knights (2 total) - hard monsters
  map[3][4] = TILE_TYPES.DARK_KNIGHT
  map[7][6] = TILE_TYPES.DARK_KNIGHT

  // Witches (2 total) - magical attackers
  map[4][6] = TILE_TYPES.WITCH
  map[6][4] = TILE_TYPES.WITCH

  // Red Slime (1 total) - harder slime variant
  map[5][8] = TILE_TYPES.RED_SLIME

  return map
}

// Create Floor 7 - First serious challenge, requires good stats
// Per specification: 1 Vampire, 1 Dragon, 2 Witches,
// 1 Yellow Key, 1 Blue Key, 1 Red Key, 2 Yellow Doors, 1 Blue Door, 1 Red Door,
// 1 Big Potion, 1 Defense Book, 1 Steel Sword, stairs up and down
function createFloor7() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add internal walls - challenging layout
  map[3][3] = TILE_TYPES.WALL
  map[3][4] = TILE_TYPES.WALL
  map[3][5] = TILE_TYPES.WALL
  map[3][6] = TILE_TYPES.WALL
  map[3][7] = TILE_TYPES.WALL
  map[7][3] = TILE_TYPES.WALL
  map[7][4] = TILE_TYPES.WALL
  map[7][5] = TILE_TYPES.WALL
  map[7][6] = TILE_TYPES.WALL
  map[7][7] = TILE_TYPES.WALL
  map[4][2] = TILE_TYPES.WALL
  map[5][2] = TILE_TYPES.WALL
  map[6][2] = TILE_TYPES.WALL
  map[4][8] = TILE_TYPES.WALL
  map[5][8] = TILE_TYPES.WALL
  map[6][8] = TILE_TYPES.WALL

  // Stairs
  map[5][1] = TILE_TYPES.STAIRS_DOWN  // Back to Floor 6
  map[5][9] = TILE_TYPES.STAIRS_UP    // Up to Floor 8

  // Yellow Key (1 total)
  map[1][5] = TILE_TYPES.YELLOW_KEY

  // Blue Key (1 total)
  map[9][5] = TILE_TYPES.BLUE_KEY

  // Red Key (1 total)
  map[5][5] = TILE_TYPES.RED_KEY

  // Yellow Doors (2 total)
  map[3][2] = TILE_TYPES.YELLOW_DOOR
  map[7][8] = TILE_TYPES.YELLOW_DOOR

  // Blue Door (1 total)
  map[4][5] = TILE_TYPES.BLUE_DOOR

  // Red Door (1 total)
  map[6][5] = TILE_TYPES.RED_DOOR

  // Big Potion (1 total)
  map[1][1] = TILE_TYPES.BIG_POTION

  // Defense Book (1 total) - permanent DEF upgrade
  map[9][9] = TILE_TYPES.DEFENSE_BOOK

  // Steel Sword (1 total) - weapon upgrade (+20 ATK)
  map[1][9] = TILE_TYPES.STEEL_SWORD

  // Vampire (1 total) - hard monster
  map[3][4] = TILE_TYPES.VAMPIRE

  // Dragon (1 total) - very hard monster
  map[7][6] = TILE_TYPES.DRAGON

  // Witches (2 total) - magical attackers
  map[4][6] = TILE_TYPES.WITCH
  map[6][4] = TILE_TYPES.WITCH

  return map
}

// Create Floor 8 - Very difficult, minimal healing
// Per specification: 2 Vampires, 1 Dragon, 1 Dark Mage,
// 1 Blue Key, 1 Red Key, 1 Yellow Door, 1 Blue Door, 2 Red Doors,
// 1 Super Potion, 1 Attack Book, 1 Iron Shield, stairs up and down
function createFloor8() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add internal walls - difficult maze
  map[2][3] = TILE_TYPES.WALL
  map[2][4] = TILE_TYPES.WALL
  map[2][5] = TILE_TYPES.WALL
  map[2][6] = TILE_TYPES.WALL
  map[2][7] = TILE_TYPES.WALL
  map[8][3] = TILE_TYPES.WALL
  map[8][4] = TILE_TYPES.WALL
  map[8][5] = TILE_TYPES.WALL
  map[8][6] = TILE_TYPES.WALL
  map[8][7] = TILE_TYPES.WALL
  map[4][2] = TILE_TYPES.WALL
  map[5][2] = TILE_TYPES.WALL
  map[6][2] = TILE_TYPES.WALL
  map[4][8] = TILE_TYPES.WALL
  map[5][8] = TILE_TYPES.WALL
  map[6][8] = TILE_TYPES.WALL

  // Stairs
  map[5][1] = TILE_TYPES.STAIRS_DOWN  // Back to Floor 7
  map[5][9] = TILE_TYPES.STAIRS_UP    // Up to Floor 9

  // Blue Key (1 total)
  map[1][5] = TILE_TYPES.BLUE_KEY

  // Red Key (1 total)
  map[9][5] = TILE_TYPES.RED_KEY

  // Yellow Door (1 total)
  map[3][2] = TILE_TYPES.YELLOW_DOOR

  // Blue Door (1 total)
  map[4][5] = TILE_TYPES.BLUE_DOOR

  // Red Doors (2 total)
  map[6][5] = TILE_TYPES.RED_DOOR
  map[5][6] = TILE_TYPES.RED_DOOR

  // Super Potion (1 total) - full heal (critical for this floor!)
  map[1][1] = TILE_TYPES.SUPER_POTION

  // Attack Book (1 total) - permanent ATK upgrade
  map[9][9] = TILE_TYPES.ATTACK_BOOK

  // Iron Shield (1 total) - defense upgrade (+15 DEF)
  map[1][9] = TILE_TYPES.IRON_SHIELD

  // Vampires (2 total) - hard monsters
  map[3][4] = TILE_TYPES.VAMPIRE
  map[7][6] = TILE_TYPES.VAMPIRE

  // Dragon (1 total) - very hard monster
  map[4][6] = TILE_TYPES.DRAGON

  // Dark Mage (1 total) - magical powerhouse
  map[6][4] = TILE_TYPES.DARK_MAGE

  return map
}

// Create Floor 9 - Mini-boss floor
// Per specification: 1 Skeleton King, 1 Dark Mage, 1 Mini Boss (guards stairs),
// 1 Red Key, 2 Red Doors,
// 1 Super Potion, 1 Holy Shield, stairs up and down
function createFloor9() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add internal walls - boss arena layout
  map[3][3] = TILE_TYPES.WALL
  map[3][4] = TILE_TYPES.WALL
  map[3][5] = TILE_TYPES.WALL
  map[3][6] = TILE_TYPES.WALL
  map[3][7] = TILE_TYPES.WALL
  map[7][3] = TILE_TYPES.WALL
  map[7][4] = TILE_TYPES.WALL
  map[7][5] = TILE_TYPES.WALL
  map[7][6] = TILE_TYPES.WALL
  map[7][7] = TILE_TYPES.WALL
  map[4][2] = TILE_TYPES.WALL
  map[5][2] = TILE_TYPES.WALL
  map[6][2] = TILE_TYPES.WALL
  map[4][8] = TILE_TYPES.WALL
  map[5][8] = TILE_TYPES.WALL
  map[6][8] = TILE_TYPES.WALL

  // Stairs
  map[5][1] = TILE_TYPES.STAIRS_DOWN  // Back to Floor 8
  map[5][9] = TILE_TYPES.STAIRS_UP    // Up to Floor 10
  // Mini Boss blocks the stairs - must defeat to proceed
  map[5][9] = TILE_TYPES.MINI_BOSS     // Mini Boss guards the stairs (overwrites STAIRS_UP)

  // Red Key (1 total)
  map[1][5] = TILE_TYPES.RED_KEY

  // Red Doors (2 total)
  map[3][2] = TILE_TYPES.RED_DOOR
  map[7][8] = TILE_TYPES.RED_DOOR

  // Super Potion (1 total) - full heal before boss
  map[1][1] = TILE_TYPES.SUPER_POTION

  // Holy Shield (1 total) - best shield (+40 DEF)
  map[9][9] = TILE_TYPES.HOLY_SHIELD

  // Skeleton King (1 total) - very hard monster
  map[3][5] = TILE_TYPES.SKELETON_KING

  // Dark Mage (1 total) - magical powerhouse
  map[7][5] = TILE_TYPES.DARK_MAGE

  return map
}

// Create Floor 10 - Final floor, confront the Tower Lord
// Per specification: 1 Floor Guardian, 1 Tower Lord (Final Boss) guarding victory stairs,
// 1 Super Potion, 1 Holy Sword (guarded by Floor Guardian),
// 1 Red Key, 1 Red Door
// Defeating Tower Lord = game victory
function createFloor10() {
  const map = Array(11).fill(null).map(() => Array(11).fill(TILE_TYPES.FLOOR))

  // Add walls around edges
  for (let i = 0; i < 11; i++) {
    map[0][i] = TILE_TYPES.WALL
    map[10][i] = TILE_TYPES.WALL
    map[i][0] = TILE_TYPES.WALL
    map[i][10] = TILE_TYPES.WALL
  }

  // Add internal walls - final boss arena
  map[3][3] = TILE_TYPES.WALL
  map[3][4] = TILE_TYPES.WALL
  map[3][5] = TILE_TYPES.WALL
  map[3][6] = TILE_TYPES.WALL
  map[3][7] = TILE_TYPES.WALL
  map[7][3] = TILE_TYPES.WALL
  map[7][4] = TILE_TYPES.WALL
  map[7][5] = TILE_TYPES.WALL
  map[7][6] = TILE_TYPES.WALL
  map[7][7] = TILE_TYPES.WALL
  map[4][2] = TILE_TYPES.WALL
  map[5][2] = TILE_TYPES.WALL
  map[6][2] = TILE_TYPES.WALL
  map[4][8] = TILE_TYPES.WALL
  map[5][8] = TILE_TYPES.WALL
  map[6][8] = TILE_TYPES.WALL

  // Stairs
  map[5][1] = TILE_TYPES.STAIRS_DOWN  // Back to Floor 9
  map[5][9] = TILE_TYPES.STAIRS_UP    // Victory stairs (game completion)
  // Note: Tower Lord at (5,8) blocks access to victory stairs

  // Red Key (1 total)
  map[1][5] = TILE_TYPES.RED_KEY

  // Red Door (1 total)
  map[5][4] = TILE_TYPES.RED_DOOR

  // Super Potion (1 total) - full heal before final battle
  map[1][1] = TILE_TYPES.SUPER_POTION

  // Holy Sword (1 total) - best weapon (+50 ATK), guarded by Floor Guardian
  map[9][9] = TILE_TYPES.HOLY_SWORD

  // Floor Guardian (1 total) - guards Holy Sword
  map[3][5] = TILE_TYPES.FLOOR_GUARDIAN

  // Tower Lord (Final Boss) (1 total) - guards victory stairs at (5,9)
  map[5][8] = TILE_TYPES.TOWER_LORD

  return map
}

export const initialGameState = {
  // Player stats
  player: {
    hp: 1000,
    maxHp: 1000,
    atk: 10,
    def: 10,
    gold: 0,
    yellowKeys: 1,
    blueKeys: 0,
    redKeys: 0,
    floor: 0,
    steps: 0,
    x: 5, // Starting position
    y: 5,
    direction: 'down' // Direction player is facing: 'up', 'down', 'left', 'right'
  },

  // Game state
  currentFloor: 0,
  victory: false,
  visitedFloors: [0],
  monstersKilled: 0,

  // Map data (will be populated from floor maps)
  maps: {
    0: createTestFloor(),
    1: createFloor1(),
    2: createFloor2(),
    3: createFloor3(),
    4: createFloor4(),
    5: createFloor5(),
    6: createFloor6(),
    7: createFloor7(),
    8: createFloor8(),
    9: createFloor9(),
    10: createFloor10()
  },

  // Current map state (doors opened, monsters defeated, items collected)
  mapStates: {},

  // Track what tiles are under monsters (for blocking mechanics)
  // Format: { floorNum: { "x,y": tileType } }
  monsterUnderlyingTiles: {
    9: {
      "5,9": TILE_TYPES.STAIRS_UP  // Mini Boss blocks stairs to Floor 10
    },
    10: {
      "3,5": TILE_TYPES.HOLY_SWORD  // Floor Guardian blocks Holy Sword
    }
  },

  // Track explored tiles for mini-map
  // Format: { floorNum: ["x,y", "x,y", ...] }
  exploredTiles: {
    0: ["5,5"] // Starting position explored
  },

  // Message log
  messages: [
    { type: 'info', text: 'Welcome to Magic Tower! Use arrow keys or WASD to move.' }
  ],

  // Equipment
  equipment: {
    sword: null,
    shield: null
  },

  // Shop state
  shopOpen: false,

  // NPC dialogue state
  npcDialogueOpen: false,
  dialogueContent: null,

  // Hidden walls that have been revealed (floor => ["x,y", ...])
  revealedHiddenWalls: {},

  // Damage numbers for combat feedback
  damageNumbers: [],

  // Item pickup animations
  itemPickups: [],

  // Door opening animations
  doorAnimations: []
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'MOVE':
      return handleMove(state, action.direction)

    case 'PICKUP_ITEM':
      return handlePickup(state, action.item, action.itemType)

    case 'COMBAT':
      return handleCombat(state, action.monster, action.monsterType)

    case 'OPEN_DOOR':
      return handleDoor(state, action.doorType)

    case 'CHANGE_FLOOR':
      return handleChangeFloor(state, action.newFloor)

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages.slice(-9), // Keep last 10 messages
          { type: action.messageType, text: action.text }
        ]
      }

    case 'UPDATE_PLAYER':
      return {
        ...state,
        player: {
          ...state.player,
          ...action.updates
        }
      }

    case 'BUY_ITEM':
      return handleBuyItem(state, action.item)

    case 'CLOSE_SHOP':
      return {
        ...state,
        shopOpen: false
      }

    case 'OPEN_NPC_DIALOGUE':
      return {
        ...state,
        npcDialogueOpen: true,
        dialogueContent: action.payload
      }

    case 'CLOSE_NPC_DIALOGUE':
      return {
        ...state,
        npcDialogueOpen: false,
        dialogueContent: null
      }

    case 'LOAD_GAME':
      return {
        ...state,
        player: action.payload.player || state.player,
        currentFloor: action.payload.currentFloor || state.currentFloor,
        victory: action.payload.victory || false,
        visitedFloors: action.payload.visitedFloors || [0],
        monstersKilled: action.payload.monstersKilled || 0,
        maps: action.payload.maps || state.maps,
        exploredTiles: action.payload.exploredTiles || { 0: ["5,5"] },
        messages: [
          { type: 'info', text: 'Game loaded successfully!' }
        ]
      }

    case 'ADD_DAMAGE_NUMBER':
      return {
        ...state,
        damageNumbers: [
          ...state.damageNumbers,
          {
            id: action.id,
            x: action.x,
            y: action.y,
            damage: action.damage,
            type: action.type,
            timestamp: Date.now()
          }
        ]
      }

    case 'REMOVE_DAMAGE_NUMBER':
      return {
        ...state,
        damageNumbers: state.damageNumbers.filter(dn => dn.id !== action.id)
      }

    case 'ADD_ITEM_PICKUP':
      return {
        ...state,
        itemPickups: [
          ...state.itemPickups,
          {
            id: action.id,
            x: action.x,
            y: action.y,
            itemType: action.itemType,
            timestamp: Date.now()
          }
        ]
      }

    case 'REMOVE_ITEM_PICKUP':
      return {
        ...state,
        itemPickups: state.itemPickups.filter(ip => ip.id !== action.id)
      }

    case 'ADD_DOOR_ANIMATION':
      return {
        ...state,
        doorAnimations: [
          ...state.doorAnimations,
          {
            id: action.id,
            x: action.x,
            y: action.y,
            doorType: action.doorType,
            timestamp: Date.now()
          }
        ]
      }

    case 'REMOVE_DOOR_ANIMATION':
      return {
        ...state,
        doorAnimations: state.doorAnimations.filter(da => da.id !== action.id)
      }

    case 'DOOR_ANIMATION_COMPLETE':
      // After animation completes, actually move the player
      const doorAnim = state.doorAnimations.find(da => da.id === action.id)
      if (!doorAnim) return state

      // Call completeDoorOpening with the pending movement data (door already removed from map)
      return completeDoorOpening(state, doorAnim.pendingDoorType, doorAnim.pendingNewX, doorAnim.pendingNewY, doorAnim.pendingDirection)

    default:
      return state
  }
}

// Helper function to reveal adjacent hidden walls
function revealAdjacentHiddenWalls(state) {
  const { player, currentFloor, maps, revealedHiddenWalls } = state
  const currentMap = maps[currentFloor]
  if (!currentMap) return state

  // Directions to check: up, down, left, right
  const directions = [
    { dx: 0, dy: -1 },  // up
    { dx: 0, dy: 1 },   // down
    { dx: -1, dy: 0 },  // left
    { dx: 1, dy: 0 }    // right
  ]

  let newlyRevealed = []
  const floorRevealed = revealedHiddenWalls[currentFloor] || []

  // Check each adjacent tile
  for (const dir of directions) {
    const checkX = player.x + dir.dx
    const checkY = player.y + dir.dy

    // Check bounds
    if (checkX < 0 || checkX >= 11 || checkY < 0 || checkY >= 11) continue

    // Check if it's a hidden wall
    if (currentMap[checkY][checkX] === TILE_TYPES.HIDDEN_WALL) {
      const wallKey = `${checkX},${checkY}`

      // If not already revealed, mark it for revelation
      if (!floorRevealed.includes(wallKey) && !newlyRevealed.includes(wallKey)) {
        newlyRevealed.push(wallKey)
      }
    }
  }

  // If no new walls revealed, return original state
  if (newlyRevealed.length === 0) return state

  // Update revealed hidden walls
  const updatedFloorRevealed = [...floorRevealed, ...newlyRevealed]

  return {
    ...state,
    revealedHiddenWalls: {
      ...revealedHiddenWalls,
      [currentFloor]: updatedFloorRevealed
    },
    messages: [
      ...state.messages.slice(-9),
      { type: 'info', text: `Hidden wall${newlyRevealed.length > 1 ? 's' : ''} revealed!` }
    ]
  }
}

// Helper function to mark adjacent tiles as explored for mini-map
function markTilesAsExplored(state) {
  const { player, currentFloor, exploredTiles } = state

  // Mark current position and adjacent tiles as explored
  const directions = [
    { dx: 0, dy: 0 },   // current tile
    { dx: 0, dy: -1 },  // up
    { dx: 0, dy: 1 },   // down
    { dx: -1, dy: 0 },  // left
    { dx: 1, dy: 0 }    // right
  ]

  const floorExplored = exploredTiles[currentFloor] || []
  const newExplored = [...floorExplored]

  // Mark each adjacent tile as explored
  for (const dir of directions) {
    const exploreX = player.x + dir.dx
    const exploreY = player.y + dir.dy

    // Check bounds
    if (exploreX < 0 || exploreX >= 11 || exploreY < 0 || exploreY >= 11) continue

    const tileKey = `${exploreX},${exploreY}`

    // If not already explored, mark it
    if (!newExplored.includes(tileKey)) {
      newExplored.push(tileKey)
    }
  }

  // Only update state if something new was explored
  if (newExplored.length === floorExplored.length) return state

  return {
    ...state,
    exploredTiles: {
      ...exploredTiles,
      [currentFloor]: newExplored
    }
  }
}

function handleMove(state, direction) {
  const { player } = state
  let newX = player.x
  let newY = player.y

  switch (direction) {
    case 'up':
      newY -= 1
      break
    case 'down':
      newY += 1
      break
    case 'left':
      newX -= 1
      break
    case 'right':
      newX += 1
      break
    default:
      return state
  }

  // Check bounds (assuming 11x11 grid)
  if (newX < 0 || newX >= 11 || newY < 0 || newY >= 11) {
    return state
  }

  // Get current map
  const currentMap = state.maps[state.currentFloor]
  if (!currentMap) return state

  const targetTile = currentMap[newY][newX]

  // Check for wall
  if (targetTile === TILE_TYPES.WALL) {
    return state
  }

  // Check for hidden wall
  if (targetTile === TILE_TYPES.HIDDEN_WALL) {
    const wallKey = `${newX},${newY}`
    const floorRevealed = state.revealedHiddenWalls[state.currentFloor] || []

    // Only allow movement if hidden wall has been revealed
    if (!floorRevealed.includes(wallKey)) {
      // Not revealed yet, check if adjacent to reveal it
      return revealAdjacentHiddenWalls(state)
    }
    // Revealed - allow movement (continue to normal movement at end)
  }

  // Reveal adjacent hidden walls whenever player moves
  const stateAfterReveal = revealAdjacentHiddenWalls(state)

  // If state changed (walls were revealed), use the updated state
  const stateToUse = stateAfterReveal !== state ? stateAfterReveal : state

  // Check for doors
  if (targetTile >= 10 && targetTile <= 12) {
    // Check if player has the required key
    let keyCount = 0
    switch (targetTile) {
      case TILE_TYPES.YELLOW_DOOR:
        keyCount = stateToUse.player.yellowKeys
        break
      case TILE_TYPES.BLUE_DOOR:
        keyCount = stateToUse.player.blueKeys
        break
      case TILE_TYPES.RED_DOOR:
        keyCount = stateToUse.player.redKeys
        break
    }

    // If no key, show error immediately
    if (keyCount <= 0) {
      return handleDoor(stateToUse, targetTile, newX, newY, direction)
    }

    // Has key - add animation and store pending movement
    const tileSize = 48
    const animX = newX * tileSize
    const animY = newY * tileSize

    // Immediately remove door from map so it doesn't show under the animation
    const updatedMap = [...stateToUse.maps[stateToUse.currentFloor]]
    updatedMap[newY] = [...updatedMap[newY]]
    updatedMap[newY][newX] = TILE_TYPES.FLOOR

    // Update maps with the door removed
    const updatedMaps = [...stateToUse.maps]
    updatedMaps[stateToUse.currentFloor] = updatedMap

    return {
      ...stateToUse,
      maps: updatedMaps,
      doorAnimations: [
        ...stateToUse.doorAnimations,
        {
          id: `door-${Date.now()}`,
          x: animX,
          y: animY,
          doorType: getDoorTypeName(targetTile),
          pendingDoorType: targetTile,
          pendingNewX: newX,
          pendingNewY: newY,
          pendingDirection: direction,
          timestamp: Date.now()
        }
      ]
    }
  }

  // Check for stairs
  if (targetTile === TILE_TYPES.STAIRS_UP) {
    return handleChangeFloor(stateToUse, stateToUse.currentFloor + 1, 'up')
  }
  if (targetTile === TILE_TYPES.STAIRS_DOWN) {
    return handleChangeFloor(stateToUse, stateToUse.currentFloor - 1, 'down')
  }

  // Check for items
  if (targetTile >= 20 && targetTile <= 81) {
    return handlePickup(stateToUse, targetTile, newX, newY, direction)
  }

  // Check for monsters
  if (targetTile >= 100 && targetTile < 300) {
    return handleCombat(stateToUse, targetTile, newX, newY, direction)
  }

  // Check for NPCs
  if (targetTile === TILE_TYPES.NPC || targetTile === TILE_TYPES.SHOPKEEPER) {
    return handleNPC(stateToUse, targetTile)
  }

  // Normal movement (including onto revealed hidden walls)
  const movedState = {
    ...stateToUse,
    player: {
      ...stateToUse.player,
      x: newX,
      y: newY,
      direction: direction, // Update player direction based on movement
      steps: stateToUse.player.steps + 1
    }
  }

  // Mark tiles as explored for mini-map
  return markTilesAsExplored(movedState)
}

function handlePickup(state, itemType, newX, newY, direction) {
  let updates = {}
  let messageText = ''
  let messageType = 'success'

  // Get item type name for animation
  const getItemTypeName = (tileType) => {
    switch (tileType) {
      case TILE_TYPES.YELLOW_KEY: return 'yellowKey'
      case TILE_TYPES.BLUE_KEY: return 'blueKey'
      case TILE_TYPES.RED_KEY: return 'redKey'
      case TILE_TYPES.SMALL_POTION: return 'smallPotion'
      case TILE_TYPES.BIG_POTION: return 'bigPotion'
      case TILE_TYPES.SUPER_POTION: return 'superPotion'
      case TILE_TYPES.RED_GEM: return 'redGem'
      case TILE_TYPES.BLUE_GEM: return 'blueGem'
      case TILE_TYPES.GREEN_GEM: return 'greenGem'
      case TILE_TYPES.GOLD_PILE: return 'goldPile'
      case TILE_TYPES.BIG_GOLD_PILE: return 'bigGoldPile'
      case TILE_TYPES.IRON_SWORD: return 'ironSword'
      case TILE_TYPES.STEEL_SWORD: return 'steelSword'
      case TILE_TYPES.HOLY_SWORD: return 'holySword'
      case TILE_TYPES.WOODEN_SHIELD: return 'woodenShield'
      case TILE_TYPES.IRON_SHIELD: return 'ironShield'
      case TILE_TYPES.HOLY_SHIELD: return 'holyShield'
      case TILE_TYPES.ATTACK_BOOK: return 'attackBook'
      case TILE_TYPES.DEFENSE_BOOK: return 'defenseBook'
      default: return 'item'
    }
  }

  switch (itemType) {
    case TILE_TYPES.YELLOW_KEY:
      updates.yellowKeys = state.player.yellowKeys + 1
      messageText = 'Picked up Yellow Key'
      break
    case TILE_TYPES.BLUE_KEY:
      updates.blueKeys = state.player.blueKeys + 1
      messageText = 'Picked up Blue Key'
      break
    case TILE_TYPES.RED_KEY:
      updates.redKeys = state.player.redKeys + 1
      messageText = 'Picked up Red Key'
      break
    case TILE_TYPES.SMALL_POTION:
      updates.hp = Math.min(state.player.hp + 200, state.player.maxHp)
      messageText = 'Used Small Potion (+200 HP)'
      break
    case TILE_TYPES.BIG_POTION:
      updates.hp = Math.min(state.player.hp + 500, state.player.maxHp)
      messageText = 'Used Big Potion (+500 HP)'
      break
    case TILE_TYPES.SUPER_POTION:
      updates.hp = state.player.maxHp
      messageText = 'Used Super Potion (Full Heal)'
      break
    case TILE_TYPES.RED_GEM:
      updates.atk = state.player.atk + 3
      messageText = 'Picked up Red Gem (+3 ATK)'
      break
    case TILE_TYPES.BLUE_GEM:
      updates.def = state.player.def + 3
      messageText = 'Picked up Blue Gem (+3 DEF)'
      break
    case TILE_TYPES.GREEN_GEM:
      updates.atk = state.player.atk + 1
      updates.def = state.player.def + 1
      messageText = 'Picked up Green Gem (+1 ATK, +1 DEF)'
      break
    case TILE_TYPES.GOLD_PILE:
      updates.gold = state.player.gold + 50
      messageText = 'Picked up 50 Gold'
      break
    case TILE_TYPES.BIG_GOLD_PILE:
      updates.gold = state.player.gold + 200
      messageText = 'Picked up 200 Gold'
      break
    case TILE_TYPES.IRON_SWORD:
      return handleEquipmentPickup(state, TILE_TYPES.IRON_SWORD, newX, newY)
    case TILE_TYPES.STEEL_SWORD:
      return handleEquipmentPickup(state, TILE_TYPES.STEEL_SWORD, newX, newY)
    case TILE_TYPES.HOLY_SWORD:
      return handleEquipmentPickup(state, TILE_TYPES.HOLY_SWORD, newX, newY)
    case TILE_TYPES.WOODEN_SHIELD:
      return handleEquipmentPickup(state, TILE_TYPES.WOODEN_SHIELD, newX, newY)
    case TILE_TYPES.IRON_SHIELD:
      return handleEquipmentPickup(state, TILE_TYPES.IRON_SHIELD, newX, newY)
    case TILE_TYPES.HOLY_SHIELD:
      return handleEquipmentPickup(state, TILE_TYPES.HOLY_SHIELD, newX, newY)
    case TILE_TYPES.ATTACK_BOOK:
      updates.atk = state.player.atk + 3
      messageText = 'Read Attack Book (+3 ATK)'
      break
    case TILE_TYPES.DEFENSE_BOOK:
      updates.def = state.player.def + 3
      messageText = 'Read Defense Book (+3 DEF)'
      break
    default:
      return state
  }

  // Remove item from map
  const updatedMap = [...state.maps[state.currentFloor]]
  updatedMap[newY] = [...updatedMap[newY]]
  updatedMap[newY][newX] = TILE_TYPES.FLOOR

  // Calculate position for item pickup animation (center of tile)
  const tileSize = 48
  const pickupX = newX * tileSize + tileSize / 2 - 12 // Center horizontally (offset for icon size)
  const pickupY = newY * tileSize + tileSize / 2 - 12 // Center vertically

  return {
    ...state,
    player: {
      ...state.player,
      ...updates,
      x: newX,
      y: newY,
      direction: direction, // Update player direction based on movement
      steps: state.player.steps + 1
    },
    maps: {
      ...state.maps,
      [state.currentFloor]: updatedMap
    },
    messages: [
      ...state.messages.slice(-9),
      { type: messageType, text: messageText }
    ],
    itemPickups: [
      ...state.itemPickups,
      {
        id: `pickup-${Date.now()}`,
        x: pickupX,
        y: pickupY,
        itemType: getItemTypeName(itemType),
        timestamp: Date.now()
      }
    ]
  }
}

function handleEquipmentPickup(state, itemType, newX, newY) {
  const equipmentStats = EQUIPMENT_STATS[itemType]
  if (!equipmentStats) return state

  let messageText = `Equipped ${equipmentStats.name}`
  let messageType = 'success'

  // Get item type name for animation
  const getItemTypeName = (tileType) => {
    switch (tileType) {
      case TILE_TYPES.IRON_SWORD: return 'ironSword'
      case TILE_TYPES.STEEL_SWORD: return 'steelSword'
      case TILE_TYPES.HOLY_SWORD: return 'holySword'
      case TILE_TYPES.WOODEN_SHIELD: return 'woodenShield'
      case TILE_TYPES.IRON_SHIELD: return 'ironShield'
      case TILE_TYPES.HOLY_SHIELD: return 'holyShield'
      default: return 'item'
    }
  }

  // Update equipment state
  let updatedEquipment = { ...state.equipment }

  if (equipmentStats.type === 'sword') {
    updatedEquipment.sword = itemType
  } else if (equipmentStats.type === 'shield') {
    updatedEquipment.shield = itemType
  }

  // Remove item from map
  const updatedMap = [...state.maps[state.currentFloor]]
  updatedMap[newY] = [...updatedMap[newY]]
  updatedMap[newY][newX] = TILE_TYPES.FLOOR

  // Calculate position for item pickup animation (center of tile)
  const tileSize = 48
  const pickupX = newX * tileSize + tileSize / 2 - 12 // Center horizontally (offset for icon size)
  const pickupY = newY * tileSize + tileSize / 2 - 12 // Center vertically

  // Calculate new effective stats
  const effectiveStats = getEffectivePlayerStats(state.player, updatedEquipment)

  return {
    ...state,
    equipment: updatedEquipment,
    player: {
      ...state.player,
      x: newX,
      y: newY,
      steps: state.player.steps + 1
    },
    maps: {
      ...state.maps,
      [state.currentFloor]: updatedMap
    },
    messages: [
      ...state.messages.slice(-9),
      {
        type: messageType,
        text: messageText
      }
    ],
    itemPickups: [
      ...state.itemPickups,
      {
        id: `pickup-${Date.now()}`,
        x: pickupX,
        y: pickupY,
        itemType: getItemTypeName(itemType),
        timestamp: Date.now()
      }
    ]
  }
}

function handleCombat(state, monsterType, newX, newY, direction) {
  const monster = MONSTER_STATS[monsterType]
  if (!monster) return state

  const player = state.player

  // Calculate effective player stats (base + equipment bonuses)
  const effectiveStats = getEffectivePlayerStats(player, state.equipment)

  // Calculate damage per round using effective stats
  const playerDamage = Math.max(0, effectiveStats.atk - monster.def)
  const monsterDamage = Math.max(0, monster.atk - effectiveStats.def)

  // Simulate combat and collect damage numbers
  let playerHp = player.hp
  let monsterHp = monster.hp
  let rounds = 0
  const newDamageNumbers = []

  // Calculate tile position for damage numbers (center of tile + offset)
  // Assuming 48px tile size based on typical grid layouts
  const tileSize = 48
  const baseX = newX * tileSize + tileSize / 2
  const baseY = newY * tileSize + tileSize / 2

  while (playerHp > 0 && monsterHp > 0) {
    // Player attacks monster
    if (playerDamage > 0) {
      const id = Date.now() + rounds * 2
      newDamageNumbers.push({
        id,
        x: baseX + (Math.random() - 0.5) * 20, // Slight random offset
        y: baseY - 20 - rounds * 10, // Stack damage numbers upward
        damage: playerDamage,
        type: playerDamage > monster.hp * 0.3 ? 'critical' : 'player-dealt',
        timestamp: Date.now()
      })
    }

    monsterHp -= playerDamage
    if (monsterHp <= 0) break

    // Monster attacks player
    if (monsterDamage > 0) {
      const id = Date.now() + rounds * 2 + 1
      // Show player damage taken at player's position
      const playerX = player.x * tileSize + tileSize / 2
      const playerY = player.y * tileSize + tileSize / 2
      newDamageNumbers.push({
        id,
        x: playerX + (Math.random() - 0.5) * 20,
        y: playerY - 20 - rounds * 10,
        damage: monsterDamage,
        type: 'player-taken',
        timestamp: Date.now()
      })
    }

    playerHp -= monsterDamage
    rounds++
  }

  // Player wins
  if (playerHp > 0) {
    // Remove monster from map
    const updatedMap = [...state.maps[state.currentFloor]]
    updatedMap[newY] = [...updatedMap[newY]]

    // Special case: Mini Boss blocks stairs to Floor 10
    // When defeated, reveal the stairs underneath
    if (monsterType === TILE_TYPES.MINI_BOSS) {
      updatedMap[newY][newX] = TILE_TYPES.STAIRS_UP
    } else if (monsterType === TILE_TYPES.FLOOR_GUARDIAN) {
      // Floor Guardian guards Holy Sword, reveal it when defeated
      updatedMap[newY][newX] = TILE_TYPES.HOLY_SWORD
    } else {
      updatedMap[newY][newX] = TILE_TYPES.FLOOR
    }

    return {
      ...state,
      monstersKilled: state.monstersKilled + 1,
      player: {
        ...player,
        hp: playerHp,
        x: newX,
        y: newY,
        direction: direction, // Update player direction based on movement
        steps: player.steps + 1
      },
      maps: {
        ...state.maps,
        [state.currentFloor]: updatedMap
      },
      messages: [
        ...state.messages.slice(-9),
        { type: 'success', text: `Defeated ${monster.name}! Took ${player.hp - playerHp} damage in ${rounds} rounds.` }
      ],
      damageNumbers: [
        ...state.damageNumbers,
        ...newDamageNumbers
      ]
    }
  }

  // Player loses
  return {
    ...state,
    player: {
      ...player,
      hp: 0
    },
    messages: [
      ...state.messages.slice(-9),
      { type: 'error', text: `Defeated by ${monster.name}...` }
    ],
    damageNumbers: [
      ...state.damageNumbers,
      ...newDamageNumbers
    ]
  }
}

function handleDoor(state, doorType, newX, newY, direction) {
  let keyCount = 0
  let keyName = ''
  let doorName = ''

  switch (doorType) {
    case TILE_TYPES.YELLOW_DOOR:
      keyCount = state.player.yellowKeys
      keyName = 'Yellow'
      doorName = 'Yellow Door'
      break
    case TILE_TYPES.BLUE_DOOR:
      keyCount = state.player.blueKeys
      keyName = 'Blue'
      doorName = 'Blue Door'
      break
    case TILE_TYPES.RED_DOOR:
      keyCount = state.player.redKeys
      keyName = 'Red'
      doorName = 'Red Door'
      break
    default:
      return state
  }

  if (keyCount <= 0) {
    return {
      ...state,
      messages: [
        ...state.messages.slice(-9),
        { type: 'error', text: `Need ${keyName} Key to open ${doorName}` }
      ]
    }
  }

  // Open door
  const updatedMap = [...state.maps[state.currentFloor]]
  updatedMap[newY] = [...updatedMap[newY]]
  updatedMap[newY][newX] = TILE_TYPES.FLOOR

  return {
    ...state,
    player: {
      ...state.player,
      x: newX,
      y: newY,
      direction: direction, // Update player direction based on movement
      steps: state.player.steps + 1,
      yellowKeys: doorType === TILE_TYPES.YELLOW_DOOR ? state.player.yellowKeys - 1 : state.player.yellowKeys,
      blueKeys: doorType === TILE_TYPES.BLUE_DOOR ? state.player.blueKeys - 1 : state.player.blueKeys,
      redKeys: doorType === TILE_TYPES.RED_DOOR ? state.player.redKeys - 1 : state.player.redKeys
    },
    maps: {
      ...state.maps,
      [state.currentFloor]: updatedMap
    },
    messages: [
      ...state.messages.slice(-9),
      { type: 'info', text: `Opened ${doorName}` }
    ]
  }
}

// Complete door opening after animation finishes (door already removed from map)
function completeDoorOpening(state, doorType, newX, newY, direction) {
  let keyName = ''
  let doorName = ''

  switch (doorType) {
    case TILE_TYPES.YELLOW_DOOR:
      keyName = 'Yellow'
      doorName = 'Yellow Door'
      break
    case TILE_TYPES.BLUE_DOOR:
      keyName = 'Blue'
      doorName = 'Blue Door'
      break
    case TILE_TYPES.RED_DOOR:
      keyName = 'Red'
      doorName = 'Red Door'
      break
    default:
      return state
  }

  return {
    ...state,
    player: {
      ...state.player,
      x: newX,
      y: newY,
      direction: direction,
      steps: state.player.steps + 1,
      yellowKeys: doorType === TILE_TYPES.YELLOW_DOOR ? state.player.yellowKeys - 1 : state.player.yellowKeys,
      blueKeys: doorType === TILE_TYPES.BLUE_DOOR ? state.player.blueKeys - 1 : state.player.blueKeys,
      redKeys: doorType === TILE_TYPES.RED_DOOR ? state.player.redKeys - 1 : state.player.redKeys
    },
    messages: [
      ...state.messages.slice(-9),
      { type: 'info', text: `Opened ${doorName}` }
    ]
  }
}

function handleNPC(state, npcType) {
  let messageText = ''
  let messageType = 'info'

  switch (npcType) {
    case TILE_TYPES.NPC:
      // Open NPC dialogue modal with helpful tips
      const dialoguePages = [
        {
          title: 'Welcome to Magic Tower!',
          text: 'Greetings, brave adventurer! I am the Guide, and I will help you navigate this mysterious tower.\n\nThe Magic Tower is a dangerous place filled with monsters, puzzles, and treasures. Reach the top floor to claim victory!',
          image: '🧙‍♂️'
        },
        {
          title: 'Basic Controls',
          text: '• Move: Arrow Keys (↑↓←→) or WASD\n• Mouse: Click adjacent tiles to move\n• Interact: Simply bump into objects\n\nClick on tiles next to you to move there.',
          image: '🎮'
        },
        {
          title: 'Combat System',
          text: 'Combat is automatic! Just bump into monsters to attack them.\n\nCombat Formula:\n• Damage to monster = Your ATK - Monster DEF\n• Damage to you = Monster ATK - Your DEF\n\nPlan your battles carefully!',
          image: '⚔️'
        },
        {
          title: 'Keys and Doors',
          text: '• Yellow Keys 🟡 open Yellow Doors\n• Blue Keys 🔵 open Blue Doors\n• Red Keys 🔴 open Red Doors\n\nKeys are limited! Use them wisely and explore thoroughly to find all keys.',
          image: '🔑'
        },
        {
          title: 'Items and Equipment',
          text: '• Potions: Restore HP (Small +200, Big +500, Super = Full)\n• Gems: Increase ATK (Red) or DEF (Blue)\n• Equipment: Swords and Shields boost stats\n\nCollect items to grow stronger!',
          image: '💊'
        },
        {
          title: 'Tips for Success',
          text: '1. Explore every floor thoroughly\n2. Fight weaker monsters first to gain stats\n3. Save potions for tough battles\n4. Some walls are hidden - look for clues!\n5. Shopkeepers sell useful items\n\nGood luck, adventurer!',
          image: '🗺️'
        }
      ]

      return {
        ...state,
        messages: [
          ...state.messages.slice(-9),
          { type: 'info', text: 'NPC Guide: Greetings, adventurer! Let me share some wisdom...' }
        ],
        npcDialogueOpen: true,
        dialogueContent: {
          npcName: 'NPC Guide',
          dialoguePages: dialoguePages
        }
      }
    case TILE_TYPES.SHOPKEEPER:
      messageText = 'Shopkeeper: Welcome to my shop!'
      messageType = 'info'
      // Return state with shopOpen flag
      return {
        ...state,
        messages: [
          ...state.messages.slice(-9),
          { type: messageType, text: messageText }
        ],
        shopOpen: true
      }
    default:
      return state
  }

  return {
    ...state,
    messages: [
      ...state.messages.slice(-9),
      { type: messageType, text: messageText }
    ]
  }
}

function handleBuyItem(state, item) {
  // Check if player has enough gold
  if (state.player.gold < item.price) {
    return {
      ...state,
      messages: [
        ...state.messages.slice(-9),
        { type: 'error', text: 'Not enough gold!' }
      ]
    }
  }

  // Deduct gold and add item
  const updates = {
    gold: state.player.gold - item.price
  }

  // Add item based on type
  switch (item.id) {
    case 'small_potion':
      updates.hp = Math.min(state.player.hp + 200, state.player.maxHp)
      break
    case 'big_potion':
      updates.hp = Math.min(state.player.hp + 500, state.player.maxHp)
      break
    case 'yellow_key':
      updates.yellowKeys = state.player.yellowKeys + 1
      break
    case 'blue_key':
      updates.blueKeys = state.player.blueKeys + 1
      break
    case 'red_key':
      updates.redKeys = state.player.redKeys + 1
      break
    case 'red_gem':
      updates.atk = state.player.atk + 3
      break
    case 'blue_gem':
      updates.def = state.player.def + 3
      break
    default:
      return state
  }

  return {
    ...state,
    player: {
      ...state.player,
      ...updates
    },
    messages: [
      ...state.messages.slice(-9),
      { type: 'success', text: `Purchased ${item.name}!` }
    ]
  }
}

function handleChangeFloor(state, newFloor, direction = null) {
  if (newFloor < 0 || newFloor > 10) return state

  // Get the new floor map
  const newMap = state.maps[newFloor]
  if (!newMap) return state

  // Find player position on new floor (opposite stairs)
  let newX = state.player.x
  let newY = state.player.y

  if (direction === 'up') {
    // Player went up stairs, find stairs down on new floor
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 11; x++) {
        if (newMap[y][x] === TILE_TYPES.STAIRS_DOWN) {
          newX = x
          newY = y
          break
        }
      }
    }
  } else if (direction === 'down') {
    // Player went down stairs, find stairs up on new floor
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 11; x++) {
        if (newMap[y][x] === TILE_TYPES.STAIRS_UP) {
          newX = x
          newY = y
          break
        }
      }
    }
  }

  // Update visited floors
  const visitedFloors = [...state.visitedFloors]
  if (!visitedFloors.includes(newFloor)) {
    visitedFloors.push(newFloor)
  }

  return {
    ...state,
    currentFloor: newFloor,
    player: {
      ...state.player,
      floor: newFloor,
      x: newX,
      y: newY
    },
    visitedFloors,
    messages: [
      ...state.messages.slice(-9),
      { type: 'info', text: `Entered Floor ${newFloor}` }
    ]
  }
}

export default gameReducer
