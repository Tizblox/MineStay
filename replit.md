# Minecraft Bot Controller

## Overview

This is a Node.js-based Minecraft bot application that connects to Minecraft servers and provides automated functionality through chat commands. The bot uses the Mineflayer library to interact with Minecraft servers and includes a web-based control interface for monitoring and management.

## Recent Changes

- **July 30, 2025**: Bot successfully tested and confirmed working
  - Successfully connected to Gruppovideogiochi.aternos.me server
  - Bot spawned at position (-6.5, 71, -22.5)
  - All core functionality confirmed operational
  - Automatic reconnection system working correctly
  - Fixed duplicate login issue with stable keep-alive system
  - Implemented single-instance bot with improved reconnection logic

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modular Node.js architecture with clear separation of concerns:

- **Bot Core**: Main bot logic handling Minecraft server connections and event management
- **Command System**: Modular command handler for processing chat commands
- **Configuration Management**: Environment-based configuration with sensible defaults
- **Logging System**: Comprehensive logging with file rotation and multiple log levels
- **Web Interface**: Bootstrap-based frontend for bot monitoring and control

## Key Components

### Bot Engine (`bot.js`)
- **Purpose**: Core bot functionality and connection management
- **Features**: 
  - Automatic reconnection with exponential backoff
  - Event-driven architecture for handling Minecraft events
  - Graceful error handling and recovery
- **Dependencies**: Mineflayer library for Minecraft protocol implementation

### Command Handler (`commands.js`)
- **Purpose**: Processes and executes chat commands from players
- **Architecture**: Class-based command routing system
- **Features**:
  - Modular command registration
  - Support for both public chat and private whisper commands
  - Built-in error handling and user feedback
- **Available Commands**: help, status, time, position, players, health, say, follow, stop, come

### Configuration System (`config.js`)
- **Purpose**: Centralized configuration management
- **Features**:
  - Environment variable support with fallback defaults
  - Server connection settings (host, port, version)
  - Bot authentication (offline, Microsoft, Mojang)
  - Logging and reconnection parameters
- **Security**: Uses dotenv for sensitive credential management

### Logging System (`logger.js`)
- **Purpose**: Comprehensive logging and monitoring
- **Features**:
  - Winston-based logging with multiple transports
  - File rotation (5MB max, 5 files retained)
  - Separate error logging
  - Custom log formats for chat and command tracking
- **Log Levels**: Configurable (info, debug, error, warn)

### Web Interface (`index.html`)
- **Purpose**: Browser-based bot monitoring and control
- **Technology**: Bootstrap 5 with dark Minecraft-themed styling
- **Features**:
  - Real-time bot status monitoring
  - Console log display
  - Minecraft-inspired UI design
- **Styling**: Custom CSS with Minecraft color scheme and typography

## Data Flow

1. **Bot Initialization**: Configuration loaded → Bot instance created → Server connection established
2. **Event Processing**: Minecraft events → Event handlers → Command parsing → Response execution
3. **Command Execution**: Chat message received → Command parsing → Handler execution → Response sent
4. **Logging**: All activities → Winston logger → Console output + File storage
5. **Web Monitoring**: Bot status → Real-time updates → Web interface display

## External Dependencies

### Core Dependencies
- **mineflayer**: Minecraft bot framework for server communication
- **mineflayer-pathfinder**: Pathfinding capabilities for bot movement
- **winston**: Advanced logging framework with file rotation
- **dotenv**: Environment variable management for configuration

### Frontend Dependencies (CDN)
- **Bootstrap 5.1.3**: UI framework for responsive web interface
- **Font Awesome 6.0.0**: Icon library for enhanced UI elements

### Authentication Support
- **@azure/msal-node**: Microsoft authentication for premium Minecraft accounts
- **jsonwebtoken**: JWT handling for secure authentication flows

## Deployment Strategy

### Environment Configuration
- Uses environment variables for all sensitive and deployment-specific settings
- Fallback defaults ensure the bot can run in development without extensive setup
- Supports multiple authentication methods (offline for development, Microsoft/Mojang for production)

### Logging Strategy
- File-based logging with automatic rotation prevents disk space issues
- Separate error logs enable focused debugging
- Console output for development and real-time monitoring

### Reconnection Handling
- Automatic reconnection with configurable retry limits
- Exponential backoff prevents server flooding during outages
- Graceful degradation when maximum retry attempts are reached

### Server Compatibility
- Configurable Minecraft version support (default 1.20.1)
- Works with various server types (vanilla, modded, hosted platforms like Aternos)
- Flexible authentication supporting both premium and offline servers

The architecture prioritizes reliability, maintainability, and ease of deployment while providing a robust foundation for Minecraft bot functionality.