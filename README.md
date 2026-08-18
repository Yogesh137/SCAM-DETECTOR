# 🛡️ ScamShield AI

> AI-powered scam detection and digital safety assistant for analyzing suspicious SMS messages and screenshots.

ScamShield AI is a modern web application designed to help users identify potentially fraudulent or malicious messages before interacting with them.

The application combines **Google Gemini AI**, **Tesseract.js OCR**, and **Firebase** to provide AI-powered scam analysis, risk scoring, screenshot text extraction, scan history, and personalized security analytics.

---

## ✨ Features

### 🔐 Authentication

- Email and password registration
- Email and password login
- Google authentication
- Protected application routes
- Persistent Firebase authentication
- Secure logout
- User-specific data

### 🛡️ AI Scam Detection

- Analyze suspicious SMS messages
- AI-powered scam classification
- Risk score from 0–100
- Risk levels:
  - 🟢 Low
  - 🟡 Medium
  - 🟠 High
  - 🔴 Critical
- Scam/non-scam classification
- AI confidence score
- Scam category detection
- Suspicious indicators
- AI-generated explanation
- Recommended safety action

### 🖼️ Screenshot Scanner

- Upload suspicious screenshots
- Drag-and-drop image upload
- Image preview
- File validation
- OCR using Tesseract.js
- OCR progress indicator
- Extracted text preview
- Editable OCR text
- Analyze extracted text using Gemini
- Store screenshot scan results in Firestore

### 📊 Security Dashboard

The dashboard provides a personalized overview of the user's security activity.

Statistics include:

- Total scans
- Threats detected
- Safe messages
- Average risk score
- Risk distribution
- SMS scan count
- Screenshot scan count
- Recent scans
- Protection status

### 🕘 Scan History

- View previous scans
- View risk scores
- View risk levels
- View scan source
- View categories
- View analyzed content
- Store scan history per authenticated user

### 👤 User Profile

- Authenticated user profile
- User account information
- Firebase authentication integration

### 🌙 Dark Mode

- Light mode
- Dark mode
- Responsive UI
- Tailwind CSS dark-mode support

### 📱 Responsive Design

ScamShield AI is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

---

# 🧰 Technology Stack

## Frontend

- React
- Vite
- JavaScript
- React Router
- Tailwind CSS v4
- React Icons

## Authentication & Database

- Firebase Authentication
- Firebase Firestore

Authentication methods:

- Email/Password
- Google Sign-In

## Artificial Intelligence

- Google Gemini API
- `@google/genai`

## OCR

- Tesseract.js

## Development Tools

- npm
- Git
- GitHub
- ESLint
- Vite

---

# 🏗️ Application Architecture

```text
                         ┌─────────────────────┐
                         │    ScamShield AI    │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
              Authentication                    Dashboard
                    │                               │
             Firebase Auth                  Security Analytics
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                           ┌────────▼────────┐
                           │   Scan Engine   │
                           └────────┬────────┘
                                    │
                       ┌────────────┴────────────┐
                       │                         │
                   SMS Scan              Screenshot Scan
                       │                         │
                       │                    Tesseract.js
                       │                         │
                       │                    Extract Text
                       │                         │
                       └────────────┬────────────┘
                                    │
                              Gemini AI
                                    │
                         ┌──────────▼──────────┐
                         │   Risk Assessment   │
                         └──────────┬──────────┘
                                    │
                            Firestore Database
                                    │
                         ┌──────────▼──────────┐
                         │   Scan History      │
                         └─────────────────────┘
