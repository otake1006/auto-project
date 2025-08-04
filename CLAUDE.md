# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Full Project
- `npm run dev` - Start both client and backend in development mode
- `npm run build` - Build both client and backend for production
- `npm run format` - Format code with Prettier

### Client (Frontend)
- `cd client && npm run dev` - Start Vite dev server with hot reload
- `cd client && npm run build` - Build Vue/Phaser application for production
- `cd client && npm run preview` - Preview production build locally

### Backend (Server)
- `cd backend && npm start` - Start Colyseus server with tsx watch (auto-restart)
- `cd backend && npm run build` - Build TypeScript to JavaScript
- `cd backend && npm test` - Run Mocha test suite
- `cd backend && npm run loadtest` - Run load testing with 2 clients

## Architecture Overview

This is a real-time multiplayer battle game built with Vue.js, Phaser, and Colyseus. The architecture follows a client-server model with clear separation of concerns.

### Client Architecture (Frontend)
The client uses a **hybrid Vue + Phaser architecture**:

- **Vue Layer** (`/client/src/ui/`): Handles UI components, modals, and user interactions using Pinia for state management
- **Phaser Layer** (`/client/src/game/`): Manages game scenes, animations, and real-time gameplay
- **Core Layer** (`/client/src/core/`): Contains business logic shared between Vue and Phaser

#### Key Systems
- **Entity-Component-System (ECS)**: `World.js` manages entities and systems for game loop
- **Scene Management**: Multiple Phaser scenes (StartScene, GameScene, MatchScene, etc.)
- **Network Layer**: `NetworkManager.js` handles Colyseus client connections
- **Audio System**: `BgmManager.js` and `SoundManager.js` for background music and sound effects
- **Animation System**: Character animations managed through Phaser with JSON configuration

#### State Management
- **Pinia Stores**: gameStore, playerStore, skillStore, modalStore, sceneStore
- **Real-time Sync**: PlayerSyncSystem synchronizes server state with client entities

### Backend Architecture (Server)
Built on **Colyseus** for real-time multiplayer:

- **Room System**: `MyRoom.ts` handles game sessions with max 2 clients
- **Schema-based State**: Type-safe state synchronization using `@colyseus/schema`
- **Game Logic**: Turn-based battle system with skills, conditions, and rounds
- **Data Layer**: Card-based skill system with JSON configuration

#### Core Game Flow
1. **Matchmaking**: Players join room and select skills
2. **Battle Rounds**: Turn-based combat with skill execution
3. **Victory Conditions**: Best of 5 rounds determines winner

### Key Design Patterns

#### Skill System
Skills are **data-driven** with JSON configuration supporting:
- Conditional execution based on HP/MP/turn state
- Extensible skill effects through condition evaluation
- Client-server validation of skill usage

#### Character System
- **Character.js**: Base entity with HP/MP stats and animation control
- **CharacterView.js**: Visual representation with status bars and effects
- **Death State Management**: `isDead` flag prevents animation conflicts

#### UI Architecture
- **Modal System**: Centralized modal management with ModalDispatcher
- **Component Composition**: Reusable Vue components for cards, buttons, status displays
- **Mute System**: Generic MuteButton component with overlay X icons

## Important File Locations

### Configuration
- `client/vite.config.js` - Vite configuration with aliases and Tailwind
- `backend/tsconfig.json` - TypeScript configuration for server
- `client/public/assets/data/assets.json` - Asset loading configuration

### Game Data
- `backend/src/data/` - Skill cards, conditions, and game data definitions
- `client/public/assets/anims/` - Animation definitions (JSON format)
- `client/public/assets/images/` - Game sprites and UI assets

### Network Communication
- Environment variables: `VITE_COLYSEUS_URL` and `VITE_COLYSEUS_ROOM_NAME`
- Message types: 'ready', 'selectSkill', 'requestPlayer', 'skillLogs'

## Development Notes

### Audio System
- BGM playback managed by BgmManager with mute/unmute functionality
- Sound effects handled by SoundManager with individual SE controls
- Mute state persists across scenes and supports resume on unmute

### Animation Timing
- Character death animations take priority over attack animations
- Use `isDead` flag to prevent animation conflicts
- Animation completion callbacks ensure proper state transitions

### Workspace Structure
This is a **npm workspace** with client and backend as separate packages. Always run commands from the appropriate directory or use workspace-specific commands from the root.

### Asset Loading
Game assets are loaded through Phaser's asset system. Image and audio files are stored in `client/public/assets/` and referenced by key in the game code.