# Contact Form API

A RESTful Contact Form API built using FastAPI, MongoDB Atlas, and PyMongo. This project demonstrates backend development concepts such as CRUD operations, MongoDB integration, service-layer architecture, pagination, search functionality, exception handling, and API documentation using Swagger UI.

## Features

- Create a Contact Submission
- View All Contact Submissions
- View a Single Contact by ID
- Update Contact Details
- Delete a Contact
- Pagination Support
- Search by Name or Email
- MongoDB Atlas Integration
- Pydantic Data Validation
- Service Layer Architecture
- RESTful API Design
- Interactive Swagger Documentation

---

## Tech Stack

### Backend
- FastAPI
- PyMongo
- Pydantic
- Uvicorn

### Database
- MongoDB Atlas

### Other Tools
- Python Dotenv
- BSON

---

## Project Structure

```text
contact_api/
│
└── app/
    │
    ├── main.py
    ├── routes.py
    ├── contact_service.py
    ├── database.py
    ├── models.py
    │
    └── .env
```

---

## API Endpoints

### Create Contact

```http
POST /contacts/
```

Request Body

```json
{
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "subject": "Product Inquiry",
    "message": "Need product details"
}
```

---

### Get All Contacts

```http
GET /contacts/
```

---

### Get Contact By ID

```http
GET /contacts/{contact_id}
```

---

### Update Contact

```http
PUT /contacts/{contact_id}
```

---

### Delete Contact

```http
DELETE /contacts/{contact_id}
```

---

## Pagination

Retrieve records page-wise.

```http
GET /contacts/?page=1&limit=10
```

Parameters:

| Parameter | Description |
|------------|------------|
| page | Current Page Number |
| limit | Records Per Page |

---

## Search

Search contacts using Name or Email.

```http
GET /contacts/?search=rahul
```

The API performs a case-insensitive search using MongoDB regular expressions.

---

## Environment Variables

Create a `.env` file in the root directory.

```env
MONGO_URL=your_mongodb_atlas_connection_string
```

Example:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
```

---

## Installation

Clone Repository

```bash
git clone https://github.com/yourusername/contact-form-api.git
```

Move into project

```bash
cd contact-form-api
```

Create Virtual Environment

```bash
python -m venv venv
```

Activate Virtual Environment

Windows

```bash
venv\Scripts\activate
```

Linux / Mac

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Application

```bash
uvicorn app.main:app --reload
```

Application URL

```text
http://127.0.0.1:8000
```

Swagger Documentation

```text
http://127.0.0.1:8000/docs
```

ReDoc Documentation

```text
http://127.0.0.1:8000/redoc
```

---

## Learning Outcomes

Through this project, I gained hands-on experience with:

- FastAPI Framework
- REST API Development
- MongoDB Atlas
- PyMongo CRUD Operations
- Pydantic Validation
- Pagination Implementation
- Search and Filtering
- Service Layer Architecture
- Error Handling
- API Documentation
- Environment Variable Management

---

## Future Enhancements

- JWT Authentication
- Role-Based Access Control
- Logging
- Docker Containerization
- Unit Testing
- CI/CD Pipeline
- Deployment on Cloud Platforms

---

## Author

Dheeraj Kumar

Backend API project developed for learning production-level FastAPI and MongoDB development.
