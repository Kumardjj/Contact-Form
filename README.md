# Contact Form API

A production-oriented RESTful Contact Form API built with **FastAPI, MongoDB Atlas, and PyMongo**.

This project allows websites or applications to collect contact form submissions, detect potentially spam messages using a rule-based spam filtering system, securely store submissions in MongoDB, and send email notifications for legitimate messages.

The project follows a modular architecture with separate layers for contact management, authentication, spam detection, notifications, and database operations.

---

## Features

### Contact Management

- Create Contact Submissions
- View All Contact Submissions
- View a Single Contact by ID
- Update Contact Details
- Delete Contact Submissions

### Search and Pagination

- Pagination Support
- Search Contacts by Name
- Search Contacts by Email
- Case-insensitive MongoDB Search

### Authentication and Security

- JWT Authentication
- Protected Admin Endpoints
- HTTP Bearer Token Authentication
- Password Hashing using BCrypt
- Environment Variable Management

### Spam Detection

- Rule-Based Spam Detection System
- URL Detection
- Suspicious Keyword Detection
- Excessive Capitalization Detection
- Repeated Character Detection
- Spam Score Calculation
- Contact Classification:
  - Legitimate
  - Review
  - Spam
- Spam Reasons Stored in MongoDB

### Notifications

- Email Notification Integration
- SMTP Email Support
- Gmail SMTP Configuration
- Background Email Processing using FastAPI BackgroundTasks
- Notifications Sent Only for Legitimate Messages

### Architecture

- Service Layer Architecture
- Modular Project Structure
- Separation of Concerns
- Environment-Based Configuration
- RESTful API Design

---

# Tech Stack

## Backend

- Python
- FastAPI
- Uvicorn

## Database

- MongoDB Atlas
- PyMongo
- BSON

## Authentication

- JWT
- Python-JOSE
- Passlib
- BCrypt

## Validation

- Pydantic

## Spam Detection

- Python Dataclasses
- Regular Expressions (`re`)

## Notifications

- SMTP
- Python EmailMessage
- FastAPI BackgroundTasks

## Configuration

- Python Dotenv

---

# Project Structure

```text
contact-form-api/

│
├── main.py
├── test.py
├── requirements.txt
├── .env
├── .gitignore
│
└── app/
    │
    ├── __init__.py
    │
    ├── config.py
    ├── database.py
    ├── models.py
    ├── routes.py
    ├── contact_service.py
    ├── security.py
    ├── auth.py
    │
    ├── spam/
    │   ├── __init__.py
    │   ├── models.py
    │   ├── rules.py
    │   └── service.py
    │
    └── notifications/
        ├── __init__.py
        ├── email.py
        └── service.py