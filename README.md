# Book Finder

A simple web application to search for books using the Google Books API. Users can search by title, author, or keyword, and sort results by relevance or newest. The app is containerized with Docker for easy deployment.

## ✅ Assignment Status: COMPLETED

This project successfully fulfills the requirements for the API Integration Assignment:
- ✅ **Part One**: Local implementation with Google Books API
- ✅ **Part Two A**: Docker containerization and deployment with load balancing

## Features
- Search for books by title, author, or keyword
- Sort results by relevance or newest
- View book covers, titles, authors, and descriptions
- Responsive and clean UI
- Error handling for API issues
- Load balancing across multiple servers

## Tech Stack
- **Backend:** Node.js, Express, Axios
- **Frontend:** HTML, CSS, JavaScript
- **API:** [Google Books API](https://developers.google.com/books/docs/v1/using)
- **Containerization:** Docker
- **Load Balancer:** HAProxy
- **Infrastructure:** Multi-server deployment (Web01, Web02, Lb01)

## Getting Started

### Local Setup
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <repo-directory>
   ```
2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```
3. **Run the app:**
   ```bash
   node index.js
   ```
4. **Open in browser:**
   Visit [http://localhost:8080](http://localhost:8080)

### Docker Setup
1. **Build the Docker image:**
   ```bash
   docker build -t sammyn11/book-finder:v1 .
   ```
2. **Run the Docker container:**
   ```bash
   docker run -p 8080:8080 sammyn11/book-finder:v1
   ```
3. **Open in browser:**
   Visit [http://localhost:8080](http://localhost:8080)

## Deployment (Lab Setup)

### Prerequisites
- Lab environment running with web-01, web-02, and lb-01 containers
- Docker installed on all servers

### Deployment Steps

1. **Push image to Docker Hub:**
   ```bash
   docker login
   docker push sammyn11/book-finder:v1
   ```

2. **Deploy on Web01:**
   ```bash
   ssh ubuntu@localhost -p 2211
   # Install Node.js and dependencies
   sudo apt update && sudo apt install -y nodejs npm curl
   # Create and run application
   mkdir -p /home/ubuntu/book-finder
   cd /home/ubuntu/book-finder
   # Create package.json and index.js (see files below)
   npm install
   nohup npm start > app.log 2>&1 &
   ```

3. **Deploy on Web02:**
   ```bash
   ssh ubuntu@localhost -p 2212
   # Same steps as Web01
   ```

4. **Configure HAProxy on Lb01:**
   ```bash
   ssh ubuntu@localhost -p 2210
   sudo apt update && sudo apt install -y haproxy nano curl
   sudo nano /etc/haproxy/haproxy.cfg
   ```
   
   **HAProxy Configuration:**
   ```bash
   global
       log /dev/log local0
       log /dev/log local1 notice
       chroot /var/lib/haproxy
       stats socket /var/lib/haproxy/stats
       stats timeout 30s
       user haproxy
       group haproxy
       daemon

   defaults
       log global
       mode http
       option httplog
       option dontlognull
       timeout connect 5000
       timeout client 50000
       timeout server 50000

   frontend http_front
       bind *:80
       stats uri /haproxy?stats
       default_backend http_back

   backend http_back
       balance roundrobin
       server web-01 172.20.0.11:8080 check
       server web-02 172.20.0.12:8080 check
   ```

5. **Start HAProxy:**
   ```bash
   sudo mkdir -p /var/lib/haproxy
   sudo haproxy -f /etc/haproxy/haproxy.cfg -D
   ```

### Verification

1. **Test load balancing:**
   ```bash
   curl http://localhost
   curl http://localhost
   curl http://localhost
   ```

2. **Test from host machine:**
   ```bash
   curl http://localhost:8082
   ```

3. **Check HAProxy stats:**
   ```bash
   curl http://localhost/haproxy?stats
   ```

## Application Files

### Backend (index.js)
```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.static('frontend'));

app.get('/api/search', async (req, res) => {
    try {
        const { query, sort = 'relevance' } = req.query;
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&orderBy=${sort}&maxResults=20`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### Package.json
```json
{
  "name": "book-finder-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.0"
  }
}
```

## Docker Hub Image
- **Image:** `sammyn11/book-finder:v1`
- **Status:** Successfully pushed and deployed
- **Access:** Available for pull and deployment

## API Credits
- Powered by [Google Books API](https://developers.google.com/books/docs/v1/using)

## Security Note
- API keys and secrets (if needed) should be managed via environment variables and not committed to the repository.

## Demo Video
- [Add your demo video link here]

## License
MIT