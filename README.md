# Nusavarta - GarudaHacks 6.0 🇮🇩

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up environment variables

   ```bash
   cp .env.example .env
   ```

   Then edit the `.env` file with your actual Firebase and Google OAuth configuration. See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Features

- 🔐 **Authentication**: Email/password and Google Sign-In with Firebase
- 🔒 **Secure Configuration**: Environment variables for sensitive data
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🎨 **Modern UI**: Clean design with gradient backgrounds
- 🗃️ **Firestore Integration**: User profile management
- 📧 **Password Reset**: Email-based password recovery

## Environment Configuration

This app uses environment variables for secure configuration management. All sensitive data like API keys and OAuth client IDs are stored in a `.env` file that is not committed to version control.

**Required Environment Variables:**
- Firebase configuration (API key, project ID, etc.)
- Google OAuth client IDs (Web, iOS, Android)
- EAS project ID

See [ENV_SETUP.md](./ENV_SETUP.md) for complete setup instructions.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
