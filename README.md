# Docushare
https://Docushare.in.net
is a full-stack live note-sharing app with AI features built with React, Django, and MongoDB.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [UML Diagram](#uml-diagram)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [License](#license)

## Features
- Create, edit, and share notes in real time
- Google OAuth login
- Responsive UI with Tailwind + Shadcn
- Live updates via Django Channels & WebSockets
- AI powered tools for improved workflow
- Download your Doc in PDF, Docx, MD or JSON format

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Shadcn
- **Backend:** Django REST + Channels
- **AI:** Locally run Ollama
- **Database:** mySQL + MongoDB (for document storage) + Redis (for fast and responsive live features)
- **Infrastructure:** Docker, AWS Amplify, AWS EC2, Nginxm Cloudfare

## UML Diagram
UML Deployment Diagram (With component elements)
![UML Diagram](https://i.ibb.co/W451gjt1/UMLDiagram.png)

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/AntonKoluh/docushare.git
   cd docushare
   ```
   <br>
2. Create .env file with the following structure:
   ```env
   GOOGLE_ID=google_client_id
   GOOGLE_SECRET=google_secret
   GOOGLE_REDIRECT=google_redirect
   DJANGO_SECRET=django_secret
   VITE_BACKEND_URL=production_backend_url
   VITE_BACKEND_URL_DEBUG=http://127.0.0.1:8000
   VITE_GOOGLE_CLIENT_ID=google_client_id_for_vite
   VITE_WS_URL=production_backend_ws
   VITE_WS_URL_DEBUG=ws://127.0.0.1:8000
   REDIS_IP=production_redis_ip
   REDIS_DEBUG=127.0.0.1
   MONGO_IP=production_mongo_ip
   MONGO_IP_DEBUG=127.0.0.1
   AI_API_URL_DEBUG=debug_local_AI_ip
   AI_API_URL=production_ai_ip
   DJANGO_SETTINGS_MODULE=shorednotes.settings
   VITE_DEBUG=True
   ```
   When VITE_DEBUG is set to "True" the DEBUG vars will be used, this is done for local testing.  
   *For google auth to work there needs to be additional steps taken https://developers.google.com/identity/protocols/oauth2*
   - TODO: Cleanup .env abit, as there are multiple redundant vars.<br><br>
3. *For local testing* Install and run MongoDB and Redis locally or remotely.  
   Personally i use the following Docker images:  
   https://hub.docker.com/_/redis  
   https://hub.docker.com/_/mongo
   <br><br>
5. Download and install MikTeX https://miktex.org/download (This is required to convert documents into PDF and other formats for the download functionality to work)<br><br>
6. ```bash
   cd backend
   pip install -r requirement.txt
   python manage.py migrate
   python manage.py runserver
   ```
   <br>
7. ```bash
   cd front
   npm install
   npm run dev
   ```
   <br><br> 

### 6. **Usage / Screenshots**
## Usage
- Sign in with Google
- Create or open a doc
- Share with collaborators
- Edit in real time
- Use AI assisted tools

## Screenshots
To Be Added


## Roadmap
- [ ] Improve AI tools
- [ ] Improve mobile experience
- [ ] Dark mode toggle

## License
[MIT](LICENSE)
