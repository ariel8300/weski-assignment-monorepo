# Hotel Search Application
A basic hotel search web app!

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + SCSS
- **Backend**: NestJS + TypeScript + Axios
- **External API**: Integration with ski accommodation provider(s)

## 🐳 Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Production Mode
```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

## 🛠️ Local Development

### Prerequisites
- Node.js (LTS)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
weski-assignment-monorepo
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── hotels/         # Hotels module
│   │   │   ├── dto/        # Data transfer objects
│   │   │   │   └── ski-trip-search.dto.ts
│   │   │   ├── interfaces/ # TypeScript interfaces
│   │   │   │   └── ski-accommodation.interface.ts
│   │   │   ├── services/   # External API services
│   │   │   │   └── external-api.service.ts
│   │   │   ├── hotels.controller.ts
│   │   │   └── hotels.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── accommodation-results/  # Results display
│   │   │   ├── navbar/     # Navigation bar
│   │   │   ├── search-form/ # Search form components
│   │   │   ├── select/     # Select dropdown components
│   │   │   └── weski-logo/ # Logo component
│   │   ├── services/       # API services
│   │   │   └── api.service.ts
│   │   ├── App.tsx
│   │   ├── App.scss
│   │   └── main.tsx
│   ├── Dockerfile
├── docker-compose.yml       # Production Docker setup
├── start.bat               # Windows startup script
├── start.sh                # Linux/Mac startup script
└── README.md
```
