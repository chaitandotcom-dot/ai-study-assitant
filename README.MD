# StudyMate — AI Study Assistant

StudyMate is an AI-powered study assistant that transforms notes and topics into structured learning material using Google's Gemini API.

## Features

- **AI Summary:** Converts study notes into easy-to-understand summaries.
- **Interactive Quiz:** Generates 5 multiple-choice questions with answer checking and scoring.
- **Flashcards:** Creates flashcards for active recall and revision.
- **Explanation Styles:** Choose between simple, exam-focused, and detailed explanations.
- **Quiz Difficulty:** Choose easy, medium, or hard questions.
- **Study History:** Save and revisit previous study sessions.
- **Search History:** Find previously generated study material.
- **Dark and Light Mode:** Switch themes with your preference saved in the browser.
- **Copy and Download:** Save generated summaries.
- **API Key Management:** Add or remove your Gemini API key through Settings.

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Google Gemini API
- Browser Local Storage

## Getting Started

### 1. Download or Clone the Repository

git clone https://github.com/chaitandotcom-dot/ai-study-assitant.git 

Alternatively, download the repository as a ZIP file and extract it.

### 2. Open the Project

Open the project folder in Visual Studio Code.

### 3. Run the Application

Use the Live Server extension in VS Code:

1. Install Live Server.
2. Open `index.html`.
3. Right-click and select **Open with Live Server**.

## Getting a Free Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey).
2. Sign in with your Google account.
3. Select **Create API key**.
4. Copy your generated API key.
5. Open StudyMate and click **Settings**.
6. Paste your API key and click **Save API Key**.

You can now generate study material.

API availability and free-tier limits depend on Google's current policies.

## Project Structure

```text
StudyMate/
├── index.html
├── style.css
├── script.js
├── README.MD
└── .gitignore
```

## Data and Privacy

- StudyMate stores the API key and study history in browser Local Storage.
- Your API key is used by the frontend to communicate with the Gemini API.
- Clearing browser storage may remove saved sessions and settings.
- Do not use a personal API key in a publicly deployed frontend. Client-side API keys can be exposed; production applications should use a secure backend.

## Purpose

This project was developed as an advanced AI Study Assistant assignment to demonstrate API integration, asynchronous JavaScript, DOM manipulation, interactive UI components, browser storage, and error handling.
