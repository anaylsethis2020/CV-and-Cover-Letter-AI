# CV & Cover Letter AI Builder

## Overview
A Django web app that generates tailored cover letters using OpenAI GPT-4 and unlocks them via Stripe payment. Built for Code Institute’s full-stack capstone, ready for Heroku deployment.

## Features
- AI-powered cover letter generation
- Stripe payment integration
- Responsive, modern UI
- Secure key management via .env
- PostgreSQL support for Heroku

## Agile Planning
- User stories and project board managed in Trello (link or describe)
- Iterative development and testing

## How to Run Locally
1. Clone the repo
2. Install requirements: `pip install -r requirements.txt`
3. Add a `.env` file with your keys:
   - `OPENAI_API_KEY=...`
   - `STRIPE_PUBLISHABLE_KEY=...`
   - `STRIPE_SECRET_KEY=...`
   - `SECRET_KEY=...`
4. Run migrations: `python manage.py migrate`
5. Start server: `python manage.py runserver`

## How to Deploy to Heroku
1. Push to GitHub
2. Create Heroku app and add PostgreSQL
3. Set config vars from `.env`
4. Deploy via Heroku CLI or GitHub integration

## Payment & OpenAI
- Stripe checkout required to unlock generated cover letter
- OpenAI GPT-4 used for letter generation

## Testing
- Manual: Form validation, payment flow, error handling
- Automated: Django test suite (add details if present)

## Credits
- Built by anaylsethis2020
- OpenAI, Stripe, Django, Code Institute

## Screenshots
- Add screenshots or demo GIFs here

## License
MIT