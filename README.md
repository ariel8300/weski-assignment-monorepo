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
│   │   │   ├── hotel-modal/ # Hotel details modal with map
│   │   │   ├── hotel-map/  # Interactive map component
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
└── README.md
```

## 🔌 API Endpoints

### Backend API (Port 3001)

- `POST /hotels/search/group-size` - Search for specific group size (progressive loading)
- `GET /hotels/health` - Provider health status

### Request Format
```json
{
  "ski_site": 1,
  "from_date": "07/07/2025",
  "to_date": "07/14/2025", 
  "group_size": 4
}
```

## 🎯 Available Ski Resorts

1. **Val Thorens** (ID: 1)
2. **Courchevel** (ID: 2) 
3. **Tignes** (ID: 3)
4. **La Plagne** (ID: 4)
5. **Chamonix** (ID: 5)

## 🚀 Performance Features

- **Progressive Loading**: Results appear as they arrive from each group size
- **Parallel Processing**: Multiple group sizes processed simultaneously
- **Real-time Deduplication**: Frontend removes duplicate hotels automatically
- **Price Sorting**: Results sorted by price (lowest first)
- **Error Resilience**: Failed requests don't block other results

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Map**: Hotel locations displayed on OpenStreetMap
- **Modal Details**: Click any hotel card for comprehensive information
- **Progress Indicators**: Real-time loading progress with group size tracking
- **Smart Validation**: Date validation and user-friendly error messages
