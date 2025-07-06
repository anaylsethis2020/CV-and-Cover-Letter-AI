# CV and Cover Letter AI Generator

An AI-powered web application that helps users generate personalized content for CVs, cover letters, and other professional documents using OpenAI's GPT-3.5 model.

## Features

- **AI-Powered Content Generation**: Generate custom CV content, cover letters, and professional text using OpenAI's GPT-3.5
- **Secure API Key Management**: API keys are stored securely as environment variables and never exposed to the frontend
- **Error Handling**: Comprehensive error handling for rate limits, invalid API keys, and network issues
- **User-Friendly Interface**: Clean, responsive web interface with real-time feedback
- **Multiple Content Types**: Support for CV/resume content, cover letters, and general professional writing

## Setup Instructions

### Prerequisites

- Python 3.7 or higher
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anaylsethis2020/CV-and-Cover-Letter-AI.git
   cd CV-and-Cover-Letter-AI
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your OpenAI API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key:
   # OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the application:
   ```bash
   python app.py
   ```

5. Open your browser and navigate to `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns API status and configuration check

### Generate Content
- **POST** `/api/generate`
- **Body**: 
  ```json
  {
    "prompt": "Your content request",
    "content_type": "cv|cover_letter|general"
  }
  ```
- **Response**: Generated AI content or error message

## Usage

1. Select the type of content you want to generate (CV, Cover Letter, or General)
2. Enter a detailed prompt describing what you need
3. Click "Generate Content" to create AI-powered text
4. Copy the generated content to your clipboard
5. Use the content in your professional documents

## Error Handling

The application handles various error scenarios:
- **Missing API Key**: Clear error message when OpenAI API key is not configured
- **Rate Limits**: User-friendly message when OpenAI rate limits are exceeded
- **Authentication Errors**: Notification when API key is invalid
- **Network Issues**: Graceful handling of connection problems

## Security

- API keys are stored as environment variables and never exposed to the frontend
- All API communication is handled server-side
- Input validation and sanitization on all endpoints

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **AI Service**: OpenAI GPT-3.5 Turbo
- **Environment Management**: python-dotenv

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.