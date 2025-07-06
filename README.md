# Hotel Search Application

A modern hotel search application built with React (TypeScript) frontend and NestJS (TypeScript) backend, featuring advanced search capabilities, filtering, and a beautiful user interface.

## 🚀 Features

- **Advanced Search**: Search hotels by name, location, or amenities
- **Real-time Autocomplete**: Smart suggestions as you type
- **Advanced Filtering**: Filter by price range, rating, amenities, and locations
- **Expandable Filters**: Access all available amenities and locations
- **Pagination**: Navigate through large result sets
- **Hotel Details Modal**: Click any hotel card for detailed information
- **Responsive Design**: Works perfectly on desktop and mobile
- **Debounced Search**: Optimized search performance

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: NestJS + TypeScript
- **Styling**: CSS with modern design patterns
- **State Management**: React hooks with custom debouncing
- **API**: RESTful endpoints with pagination support

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

### Development Mode (with hot reloading)
```bash
# Build and start all services in development mode
docker-compose -f docker-compose.dev.yml up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🛠️ Local Development

### Prerequisites
- Node.js 20+ (LTS)
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
hotel-search-assignment/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── hotels/         # Hotel module
│   │   │   ├── dto/        # Data transfer objects
│   │   │   ├── interfaces/ # TypeScript interfaces
│   │   │   ├── data/       # Mock hotel data
│   │   │   └── hotels.service.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── Dockerfile.dev
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   └── types/          # TypeScript types
│   ├── Dockerfile
│   └── Dockerfile.dev
├── docker-compose.yml       # Production Docker setup
├── docker-compose.dev.yml   # Development Docker setup
└── README.md
```

## 🔧 API Endpoints

### Hotels
- `GET /hotels` - Get all hotels
- `GET /hotels/search?q={query}` - Search hotels
- `GET /hotels/advanced-search` - Advanced search with filters
- `GET /hotels/suggestions?q={query}` - Get search suggestions
- `GET /hotels/amenities` - Get available amenities
- `GET /hotels/locations` - Get available locations

### Search Parameters
- `q` - Search query (hotel name, location, amenities)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `minRating` - Minimum rating filter
- `amenities` - Comma-separated amenities
- `locations` - Comma-separated locations

## 🎨 UI Components

- **HotelSearch**: Main search interface
- **Autocomplete**: Smart search input with suggestions
- **HotelFilters**: Advanced filtering panel
- **HotelCard**: Individual hotel display
- **HotelDetailModal**: Detailed hotel information
- **Pagination**: Navigation through results

## 🔍 Search Features

- **Text Search**: Search by hotel name, location, or amenities
- **Debounced Input**: Optimized search performance
- **Autocomplete**: Real-time suggestions
- **Advanced Filters**: Price, rating, amenities, locations
- **Expandable Options**: Access all available filters
- **Pagination**: Handle large result sets

## 🐛 Troubleshooting

### Docker Issues
```bash
# Clean up Docker resources
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Port Conflicts
If ports 3000 or 3001 are in use, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "3002:3000"  # Change frontend port
  - "3003:3001"  # Change backend port
```

### Development Mode Issues
- Ensure all dependencies are installed
- Check that both frontend and backend are running
- Verify API base URL in frontend configuration

## 📝 License

This project is created as a home assignment for hotel search functionality demonstration.

## 🤝 Contributing

This is a demonstration project, but feel free to explore the code and learn from the implementation! 