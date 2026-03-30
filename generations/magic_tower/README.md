# Magic Tower (魔塔)

A fully functional classic Magic Tower web game - a turn-based RPG puzzle game where players navigate through a multi-floor tower, collecting items, fighting monsters, and solving strategic route puzzles to reach the top.

## Game Overview

Magic Tower is a traditional Chinese turn-based RPG puzzle game featuring:
- **Grid-based movement** on 11x11 tile maps
- **Turn-based combat** (bump-to-attack mechanics)
- **Key-and-door puzzles** requiring strategic planning
- **RPG stat progression** (HP, ATK, DEF)
- **Item collection and management**
- **11 unique floors** with increasing difficulty
- **Shop system** for buying items
- **Save/load functionality** with multiple slots

## Technology Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS (via CDN) + custom CSS for pixel-art sprites
- **State Management**: React hooks, context, and useReducer
- **Rendering**: HTML5 Canvas or CSS Grid for tile map rendering

### Backend
- **Runtime**: Node.js with Express
- **Database**: SQLite with better-sqlite3 for save/load game state
- **Architecture**: Pure frontend game logic with optional backend for persistence

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Installation & Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd magic_tower
   ```

2. **Run the initialization script** (Linux/Mac):
   ```bash
   chmod +x init.sh
   ./init.sh
   ```

   For Windows, use Git Bash or WSL to run the script.

3. **Access the game**:
   - Open your browser and navigate to `http://localhost:3000`
   - The game will be running and ready to play

### Manual Setup (Alternative)

If you prefer to set up manually:

1. **Install frontend dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Start the backend server** (optional, for save/load persistence):
   ```bash
   cd server
   node index.js
   ```

4. **Start the frontend development server** (in a new terminal):
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Game Controls

### Desktop
- **Arrow Keys** or **WASD**: Move player character
- **Mouse Click**: Click adjacent tiles to move
- **Escape**: Open menu/settings

### Mobile
- **Touch D-Pad**: On-screen directional controls
- **Tap**: Tap adjacent tiles to move

## Game Mechanics

### Player Stats
- **HP** (Hit Points): Current health - reach 0 and it's game over
- **Max HP**: Maximum health capacity
- **ATK** (Attack): Damage dealt per hit
- **DEF** (Defense): Damage reduced per hit
- **Gold**: Currency for shops
- **Keys**: Yellow, Blue, and Red keys for corresponding doors
- **Floor**: Current floor number (0-10)
- **Steps**: Total steps taken (affects score)

### Combat System
Combat is automatic when you move into a monster:
- Player attacks first, then monster attacks if alive
- Damage to monster = Player ATK - Monster DEF (minimum 0)
- Damage to player = Monster ATK - Player DEF (minimum 0)
- Combat continues until one HP reaches 0

### Items & Equipment

**Consumables**:
- Small Potion: +200 HP
- Big Potion: +500 HP
- Super Potion: Full heal

**Permanent Upgrades**:
- Red Gem: +3 ATK
- Blue Gem: +3 DEF
- Green Gem: +1 ATK, +1 DEF
- Attack Book: +ATK (varies by floor)
- Defense Book: +DEF (varies by floor)

**Equipment**:
- Iron Sword: +10 ATK
- Steel Sword: +20 ATK
- Holy Sword: +50 ATK
- Wooden Shield: +8 DEF
- Iron Shield: +15 DEF
- Holy Shield: +40 DEF

### Key & Door System
- **Yellow Keys**: Most common, open yellow doors
- **Blue Keys**: Less common, open blue doors
- **Red Keys**: Rare, open red doors to important areas
- Keys are limited - strategic usage is essential!

## Game Floors

- **Floor 0 (Ground Floor)**: Tutorial floor with weak monsters
- **Floors 1-3**: Easy difficulty, introduces basic mechanics
- **Floor 3**: First shop floor
- **Floors 4-6**: Medium difficulty, introduces red keys/doors
- **Flores 7-8**: Hard difficulty, minimal healing
- **Floor 9**: Mini-boss floor
- **Floor 10**: Final floor with Tower Lord (Final Boss)

## Project Structure

```
magic_tower/
├── feature_list.json          # 200+ test cases (source of truth)
├── init.sh                    # Initialization script
├── README.md                  # This file
├── app_spec.txt               # Complete game specification
├── src/                       # Frontend source code
│   ├── components/            # React components
│   ├── game/                  # Game logic and state
│   ├── maps/                  # Floor map data
│   └── utils/                 # Helper functions
├── server/                    # Backend server
│   ├── index.js              # Express server entry
│   ├── database/             # SQLite database setup
│   └── api/                  # API endpoints
└── logs/                      # Server logs
```

## Development

### Running Tests

The project includes 200+ end-to-end test cases in `feature_list.json`. Tests are organized into two categories:
- **functional**: Core game mechanics and features
- **style**: UI/UX and visual requirements

Track progress by updating the `"passes"` field from `false` to `true` as features are implemented.

### Game Balance

The game is balanced so that:
- Floor 0 is beatable with starting stats
- Progression requires strategic item collection
- Keys are scarce enough to create meaningful choices
- Each floor increases in difficulty
- The final boss is challenging but beatable with optimal play
- No softlocks exist (correct choices always lead to victory)

### Save System

- **Auto-save**: Triggers when entering new floors
- **Manual save**: 3 save slots available
- **Storage**: localStorage (client-side) and SQLite database (server-side)
- **Save data**: Player stats, inventory, current floor, map states, visited floors

## API Endpoints

### Save/Load
- `POST /api/saves` - Create new save
- `GET /api/saves` - List all saves
- `GET /api/saves/:id` - Load specific save
- `PUT /api/saves/:id` - Update save
- `DELETE /api/saves/:id` - Delete save

### Leaderboard
- `GET /api/leaderboard` - Get top scores
- `POST /api/leaderboard` - Submit score

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

### Maps
- `GET /api/maps` - Get all floor maps
- `GET /api/maps/:floor` - Get specific floor map

## Design System

### Visual Style
- **Aesthetic**: Retro pixel-art with clean modern UI
- **Theme**: Dark dungeon theme with warm accent colors
- **Palette**:
  - Background: Dark stone gray (#2D2D2D)
  - Game area: Dungeon floor (#3A3A3A)
  - Walls: Stone gray (#5C5C5C)
  - Primary accent: Golden yellow (#FFD700)
  - Player: Bright blue (#4488FF)

### Animations
- Player movement: Smooth slide (100-150ms)
- Combat: Shake effect, flash on damage
- Item pickup: Float up and fade out
- Door open: Slide animation
- HP bar: Smooth transition
- Monster idle: Subtle pulse/bob (2s cycle)
- Floor transition: Fade effect

## Contributing

This project follows a structured development approach:

1. **Research & Reuse**: Check for existing implementations before writing new code
2. **Plan First**: Create implementation plans before coding
3. **TDD Approach**: Write tests first, then implement
4. **Code Review**: Review code after implementation
5. **Commit**: Use conventional commit messages

See `feature_list.json` for the complete feature checklist.

## License

This is a demonstration project for autonomous development testing.

## Credits

Classic Magic Tower (魔塔) - Original game concept and mechanics
Modern web implementation - Built with React, Vite, and Node.js
