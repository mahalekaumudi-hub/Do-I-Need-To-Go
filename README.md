<<<<<<< HEAD
# Do I Need To Go?

Do I Need To Go? is a smart college service assistant. Students can search for services like Bonafide Certificate, Exam Form, Migration Certificate, Degree Certificate, and Extra-Curricular Activity Certificate, and the app shows whether a physical visit is likely required.

## Features

- Search college services with flexible keyword matching
- Read verified service details from MongoDB
- Show YES / NO / MAYBE visit requirement
- Display required documents, procedure, fees, processing time, department, office location, online status, and verification date
- Prototype admin area to add, update, and delete service records
- Ready for future AI/RAG integration using verified MongoDB data as the source of truth

## Tech Stack

- Frontend: React + Vite + CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Environment variables for API keys and database connection

## Folder Structure

```text
Do-I-Need-To-Go/
├── client/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── ...
├── README.md
├── .gitignore
└── package-lock.json
```

## Install Dependencies

From the project root:

```bash
cd client && npm install
cd ../server && npm install
```

## Run Frontend

```bash
cd client
npm run dev
```

The app will run on:

```text
http://localhost:5173
```

## Run Backend

```bash
cd server
npm install
npm run dev
```

The app will run on:

```text
http://localhost:5000
```

## MongoDB Setup

1. Create a MongoDB Atlas account or run a local MongoDB instance.
2. Copy the connection string.
3. In the server/.env file, set:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/do-i-need-to-go
AI_API_KEY=
```

If MONGODB_URI is not set, the server falls back to an in-memory MongoDB for local testing.

## Seed Data

```bash
cd server
npm run seed
```

This inserts five sample services into MongoDB.

## API Endpoints

- GET /api/health
- GET /api/services
- GET /api/services/:id
- GET /api/services/search?q=bonafide
- POST /api/services
- PUT /api/services/:id
- DELETE /api/services/:id

## Search Flow

1. Student types a query such as "I need a bonafide certificate".
2. React sends the request to the backend.
3. Express searches the service name and keywords in MongoDB.
4. The backend returns the relevant service record.
5. React displays the final result card.

## Future RAG / AI Integration

The architecture is prepared for a future AI layer:

```text
Student Question -> React Frontend -> Express API -> MongoDB Data -> AI Model -> Natural-language answer
```

The AI should use only verified data from MongoDB and never invent college-specific facts. If no verified service exists, the system should say that more information is needed from the college department.

## Deployment Preparation

### Frontend

- Vercel or Netlify
- Set environment variables in the hosting dashboard as needed

### Backend

- Render or another Node.js hosting solution
- Set PORT and MONGODB_URI in the environment variables

### Database

- MongoDB Atlas
- Keep database credentials out of the frontend and repository source code

## .gitignore

The project includes .env and node_modules in Git ignore rules.

## Example Search Request

```http
GET /api/services/search?q=I%20need%20a%20bonafide%20certificate
```

Example response:

```json
{
  "name": "Bonafide Certificate",
  "visitRequired": "MAYBE",
  "onlineAvailable": true,
  "documents": ["College ID", "Student details"],
  "procedure": [
    "Submit the certificate request",
    "Provide required student information",
    "Follow the instructions provided by the college"
  ],
  "fees": "To be verified",
  "processingTime": "To be verified",
  "department": "Student Section",
  "officeLocation": "To be verified",
  "onlineApplicationUrl": "",
  "conditions": ["Final requirement should be confirmed with the college"],
  "lastVerified": null,
  "status": "sample"
}
```
=======
# Do-I-Need-To-Go
A smart student service assistant that helps students understand whether a physical college visit is required.
>>>>>>> 8e6ada6c17b428bc00367aaf5f56fda968d501da
