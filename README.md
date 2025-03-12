# My diary
A simple React app that allows users to create personal diaries, add detailed entries, and explore diaries shared by others.

## Installation & Setup
### 1. Clone the repository  
```bash
git clone https://github.com/marina-del-rey/my-diary.git
cd my-diary
```
### 2. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file in the backend directory and add:
```env
MONGO_URL = "your_mongodb_connection_string"
TOKEN_KEY= your_jwt_token
PORT = 4000
DOMAIN = "your_mailserver_domain"
MAILGUN_API_KEY = "your_mailgun_api_key"
```
Then, start the backend server:
```bash
npm start
```
### 3. Frontend setup
```bash
cd ../frontend
npm install 
```
Create a `.env` file in the frontend directory and add:
```env
VITE_API_URL = http://localhost:4000
```
Then, start the React frontend:
```bash
npm run dev
```
