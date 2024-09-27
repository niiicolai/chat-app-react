[![VM Publish Production](https://github.com/niiicolai/chat-app-react/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/niiicolai/chat-app-react/actions/workflows/deploy_vm.yml)

[![Docker Hub Deploy](https://github.com/niiicolai/chat-app-react/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/niiicolai/chat-app-react/actions/workflows/deploy_docker_hub.yml)

# Chat App React+TypeScript
A React.js SPA made for the chat backend application found at https://github.com/niiicolai/chat-app.

![example](example.png)

## Features
- Mobile
    - Responsive [x]
- CSS Styles
    - Tailwind CSS [x]
- User
    - Login [x]
    - Registration [x]
    - Logout [x]
    - Edit Profile [x]
    - Delete Avatar [ ]
    - Google Registration+Login [ ]
- Room
    - Create [x]
    - Update [x]
    - Delete [x]
    - List [x]
    - Select [x]
    - Leave [x]
    - EditSettings [x]
    - Delete Avatar [ ]
    - Total File Usage Overview [x]
    - Channel Usage Overview [ ]
    - Room User Usage Overview [ ]
    - File Retention Overview [ ]
    - Message Retention Overview [ ]
    - Display Rules Text [ ]
    - Pagination [ ]
- Room Invite Link
    - Create [x]
    - Update [x]
    - Delete [x]
    - List [x]
    - Join [x]
    - Pagination [ ]
- Room Files
    - List [x]
    - Delete [x]
    - Pagination [ ]
- Room Users
    - Set to Admin [x]
    - Set to Moderator [x]
    - Set to Member [x]
    - Kick [x]
    - Client Role Check [ ]
    - Pagination [ ]
- Channel
    - Create [x]
    - Update [x]
    - Delete [x]
    - List [x]
    - Delete Avatar [ ]
    - Pagination [ ]
- Channel Webhook
    - Create [x]
    - Update [x]
    - Delete [x]
    - List [x]
    - Send Test Message [x]
    - Delete Avatar [ ]
    - Pagination [ ]
- Channel Message
    - Create [x]
    - Update [x]
    - Delete [x]
    - List [x]
    - Add File [x]
    - Delete File [x]
    - Scroll To Bottom Event [ ]
    - Infinite Scroll [ ]
- Toast
    - Create [x]
    - List [x]
    - Delete [x]
- Websocket
    - Connect [x]
    - Join Channel [ ]
    - Handle Message Events [ ]
- Logging
    - Exceptions [ ]
- Testing
    - end2end tests [ ]
- Routing
    - React Router [x]
    - Sitemap [x]
- CI/CD
    - GitHub Actions [x]
    - GitHub Secrets [x]
- Deployment
    - DigitalOcean [x]

## Development Environment Setup
The following are the steps to set up the development environment for the chat client.

### Install
```
npm install
cp .env.example .env
```

### Run
```
npm run dev
```

### Test 
```
npm test
```

### ESLint
```
npm run eslint
```

## Sitemap
```
npm run sitemap
```

## Docker

### Build
```
docker build -t chat_react:v1.0 .
```

### Run in detached mode
```
docker run -d -p 5371:5371 chat_react:v1.0 
```

## Docker Compose
**Note: You must build the docker image first.**

### Run in detached mode
```
docker compose up -d
```
