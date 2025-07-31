# Book Finder

A simple web application to search for books using the Google Books API. Users can search by title, author, or keyword, and sort results by relevance or newest. The app is containerized with Docker for easy deployment.

## Features
- Search for books by title, author, or keyword
- Sort results by relevance or newest
- View book covers, titles, authors, and descriptions
- Responsive and clean UI
- Error handling for API issues

## Tech Stack
- **Backend:** Node.js, Express, Axios
- **Frontend:** HTML, CSS, JavaScript
- **API:** [Google Books API](https://developers.google.com/books/docs/v1/using)
- **Containerization:** Docker

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
   docker build -t <your-dockerhub-username>/book-finder:v1 .
   ```
2. **Run the Docker container:**
   ```bash
   docker run -p 8080:8080 <your-dockerhub-username>/book-finder:v1
   ```
3. **Open in browser:**
   Visit [http://localhost:8080](http://localhost:8080)

## Deployment (Lab Setup)
1. **Push image to Docker Hub:**
   ```bash
   docker login
   docker push <your-dockerhub-username>/book-finder:v1
   ```
2. **On Web01 and Web02:**
   ```bash
   docker pull <your-dockerhub-username>/book-finder:v1
   docker run -d --name app --restart unless-stopped -p 8080:8080 <your-dockerhub-username>/book-finder:v1
   ```
3. **Configure HAProxy on Lb01:**
   Edit `/etc/haproxy/haproxy.cfg`:
   ```
   backend webapps
     balance roundrobin
     server web01 172.20.0.11:8080 check
     server web02 172.20.0.12:8080 check
   ```
   Reload HAProxy:
   ```bash
   docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'
   ```
4. **Test load balancing:**
   ```bash
   curl http://localhost
   ```
   Repeat several times to see responses alternate between Web01 and Web02.

## API Credits
- Powered by [Google Books API](https://developers.google.com/books/docs/v1/using)

## Security Note
- API keys and secrets (if needed) should be managed via environment variables and not committed to the repository.

## Demo Video
- [Add your demo video link here]

## License
MIT