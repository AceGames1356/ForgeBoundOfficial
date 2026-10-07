# Forgebound API Integration Guide

## Overview
This document outlines the backend API requirements for Forgebound to function with accounts, co-op, and data persistence.

## Backend Server Requirements

### Base URL
- **Production**: `https://forgeboundgame-production.up.railway.app/`
- **Development**: `http://localhost:3000/`

### API Endpoints Required

#### Authentication
- `POST /api/login` - User login
- `POST /api/signup` - User registration
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user info
- `POST /api/verify` - Verify email code
- `POST /api/verify/resend` - Resend verification code
- `POST /api/profile` - Update profile (email, DOB)

#### Game Data
- `POST /api/save` - Save game state
- `POST /api/admin/give` - Admin: give part to player
- `POST /api/admin/diamonds` - Admin: give diamonds
- `POST /api/admin/coins` - Admin: give coins
- `POST /api/admin/anniversary` - Admin: give anniversary gift
- `POST /api/admin/world` - Admin: unlock World 2
- `POST /api/admin/custom` - Admin: create custom item
- `GET /api/admin/users` - Admin: list users

#### Co-op Tower
- `POST /api/room/create` - Create co-op room
- `POST /api/room/join` - Join co-op room
- `POST /api/room/start` - Start tower climb
- `POST /api/room/swing` - Player attack
- `POST /api/room/reward` - Choose reward
- `POST /api/room/leave` - Leave room
- `GET /api/room/events` - WebSocket events (EventSource)

#### Friends & Trading
- `POST /api/friends/add` - Add friend
- `GET /api/friends/list` - List friends
- `POST /api/trade/offer` - Send trade offer
- `POST /api/trade/accept` - Accept trade
- `POST /api/chat/send` - Send message
- `GET /api/chat/messages` - Get chat history

## Authentication

All API requests (except login/signup) require:
```
Authorization: Bearer <token>
```

Token is stored in localStorage as `fb:token`

## Save State Structure

```javascript
{
  owned: [array of part IDs],           // World 1 parts
  eq: {h, b, g, c},                      // Equipped parts (World 1)
  owned2: [array of part IDs],           // World 2 parts
  eq2: {h, b, g, c},                     // Equipped parts (World 2)
  boss: number,                          // Current boss index (World 1)
  b2: number,                            // Current boss index (World 2)
  clears: number,                        // Total run clears
  coins: number,                         // Currency
  dia: number,                           // Diamonds (premium)
  gems: number,                          // Gems (real money)
  hpup: number,                          // Vitality level (World 1)
  hpup2: number,                         // Vitality level (World 2)
  world: number,                         // Current world (1 or 2)
  cl1: boolean,                          // World 1 beaten
  fx: string,                            // Current effect
  rev: number                            // Revision for conflict detection
}
```

## User Model

```javascript
{
  username: string,
  name: string,
  email: string,
  verified: boolean,
  age: number,
  dob: date,
  createdAt: date,
  caps: {
    coop: boolean,      // age >= 8
    social: boolean,    // age >= 13
    buy: boolean        // age >= 13
  },
  customs: [array of custom items]
}
```

## Error Handling

API errors return:
```javascript
{
  error: "Error message"
}
```

Common errors:
- `"Not logged in"` - Missing/invalid token
- `"Log in or create an account"` - Specific auth error
- `"The game server is not reachable"` - Server down
- `"Request failed"` - General error

## CORS Requirements

The backend must allow CORS from:
- `https://acegames1356.github.io` (production)
- `http://localhost:3000` (development)
- `file://` (for local testing)

## Rate Limiting

Recommended:
- Save: 1 per second
- API calls: 60 per minute per user

## Session Management

- Tokens expire after 30 days
- Logout clears server-side session
- Multiple devices: last login wins

## Real Money Integration

For gem purchasing:
- Stripe integration recommended
- Callback URL: `/api/purchase/callback`
- Redirect URL: `/?paid=1` on success

