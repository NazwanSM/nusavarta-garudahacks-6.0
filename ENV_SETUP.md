 Environment Variables Setup Guide

This project uses environment variables to manage sensitive configuration data like Firebase and Google OAuth keys. Follow these steps to set up your environment:

## 1. Create your .env file

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

## 2. Fill in your configuration values

Edit the `.env` file and replace the placeholder values with your actual configuration:

### Firebase Configuration
- Get these values from your Firebase project console
- Go to Project Settings > General > Your apps
- Copy the config values from your web app

### Google OAuth Configuration  
- Get these from Google Cloud Console
- Go to APIs & Credentials > Credentials
- Create OAuth 2.0 Client IDs for each platform:
  - Web client (for cross-platform compatibility)
  - iOS client (if building for iOS)
  - Android client (if building for Android)

### EAS Configuration
- Get this from your Expo dashboard
- Go to your project settings

## 3. Important Security Notes

- **Never commit the `.env` file to version control**
- The `.env` file is already added to `.gitignore`
- Share the `.env.example` file with your team instead
- Keep your production keys separate from development keys

## 4. Development vs Production

For different environments, you can create:
- `.env.development` - for development
- `.env.production` - for production
- `.env.staging` - for staging

The babel plugin will automatically load the appropriate file based on your build configuration.

## 5. Troubleshooting

If you encounter issues:

1. Make sure all required environment variables are set
2. Restart the Metro bundler after changing `.env` values
3. Clear the Expo cache: `expo start --clear`
4. Verify that your OAuth client IDs end with `.apps.googleusercontent.com`

## 6. Required Environment Variables

All variables in the `.env.example` file are required for the app to function properly:

- Firebase configuration (7 variables)
- Google OAuth client IDs (3 variables) 
- EAS project ID (1 variable)

Make sure none of these are empty or undefined.
