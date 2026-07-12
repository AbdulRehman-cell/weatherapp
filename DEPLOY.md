# Deployment Guide for Weather App on Render

## Prerequisites
- Install Docker on your machine.
- Create an account on Render (if not already done).
- Obtain your Render API key and username.

## Steps to Deploy
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. Build the Docker image:
   ```bash
   docker build -t weather-app .
   ```

3. Deploy to Render using GitHub Actions:
   - Push your changes to the main branch:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

Your application will now be deployed on Render!