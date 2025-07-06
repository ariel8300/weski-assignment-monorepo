# Hotel Search Application
A modern ski accommodation search application with progressive loading!

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + SCSS
- **Backend**: NestJS + TypeScript + Axios
- **External API**: Integration with ski accommodation provider(s)
- **Performance**: Progressive loading with real-time result aggregation

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

## 🚀 Key Features

- **Progressive Loading**: Results appear as soon as they're available from each group size
- **Real-time Aggregation**: Frontend deduplicates and sorts results as they arrive
- **Multi-Provider Support**: Scalable architecture for multiple accommodation providers
- **Responsive Design**: Modern UI that works on all devices
- **Performance Optimized**: Parallel requests with intelligent error handling

## 📁 Project Structure

```
justatest/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── hotels/         # Hotels module
│   │   │   ├── dto/        # Data transfer objects
│   │   │   ├── interfaces/ # TypeScript interfaces
│   │   │   ├── providers/  # Accommodation providers
│   │   │   ├── services/   # Business logic services
│   │   │   ├── hotels.controller.ts
│   │   │   └── hotels.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── accommodation-results/  # Results display with progress
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
