# Web Scraper Application - MERN Stack

A powerful web scraping application built with MERN stack (MongoDB, Express.js, React, and Node.js) that allows users to scrape single or multiple websites, manage scraping history, and analyze scraped data.

## Features

### Core Functionality

- **Single URL Scraping**: Extract data from individual websites
- **Bulk URL Scraping**: Process multiple URLs simultaneously (up to 20 at once)
- **Scraping History**: View, sort, and manage previously scraped data
- **Authentication**: Secure JWT-based user authentication
- **Responsive UI**: Works on all device sizes

### Advanced Features

- **Bulk Operations**:
  - Bulk scraping with parallel processing
  - Bulk deletion of scraped items
- **Data Management**:
  - Sorting by date, URL, or title
  - Search functionality across scraped content
  - "Load More" pagination for large datasets
- **Data Export**:
  - Copy scraped data as JSON
  - (Future) Export to CSV/Excel
- **Error Handling**:
  - Comprehensive validation with Zod
  - Detailed error messages
  - Failed URL tracking in bulk operations

## Tech Stack

### Frontend (Client)

- **Framework**: React with TypeScript
- **UI Library**: ShadCN UI components
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend (Server)

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Web Scraping**: Puppeteer + Cheerio
- **Validation**: Zod
- **Error Handling**: Custom error middleware
- **API Documentation**: (Future) Swagger/OpenAPI

### Development Tools

- TypeScript for type safety
- ESLint + Prettier for code quality
- Husky for Git hooks
- Vite for frontend build

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (v6+ recommended)
- Yarn or npm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pankajkandpal99/web-scrapper.git
   cd web-scraper
   ```

2. Install server dependencies:
   cd server
   npm install


3. Install client dependencies:
   cd client
   npm install

4. Set up environment variables:
    Create .env files in both client and server directories

    Example server .env:
    # Server configuration
    PORT=8800
    NODE_ENV=development
    BASE_URL=http://localhost:8800

    # Authentication
    JWT_SECRET=your_jwt_secret_here
    COOKIE_DOMAIN=localhost

    # Database
    DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

    # CORS
    ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8800


Running the Application
1. Start the server:
    cd server
    npm run dev

2. Start the client:
    cd client
    npm run dev


Future Enhancements
    Proxy Support: Rotating proxies for large-scale scraping
    Scheduled Scraping: Automate recurring scrapes
    Advanced Data Processing: NLP analysis of scraped content
    Visualizations: Charts/graphs for scraped data
    API Documentation: Swagger/OpenAPI specs
    Rate Limiting: Protect against abuse
    User Roles: Admin vs regular user privileges

Contributing
    Fork the project
    Create your feature branch (git checkout -b feature/AmazingFeature)
    Commit your changes (git commit -m 'Add some AmazingFeature')
    Push to the branch (git push origin feature/AmazingFeature)
    Open a Pull Request