import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function to start the NestJS application
 * This is the entry point of our backend server
 */
async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);
  
  // enables cross-origin requests from React frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Production frontend
      'http://localhost:5173',  // Development frontend (Vite)
      'http://127.0.0.1:3000',  // Alternative localhost
      'http://127.0.0.1:5173'   // Alternative development
    ],
    credentials: true, // Allow cookies and authentication headers
  });
  
  // Start the server on the specified port (default: 3001)
  // We use 3001 to avoid conflicts with the frontend which runs on 3000
  await app.listen(process.env.PORT ?? 3001);
  
  console.log(`🚀 Hotel Search Backend running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
