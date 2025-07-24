# Google OAuth Redirect URIs for nusavarta-garudahacks-6.0

## Add these URIs to your Google Cloud Console OAuth Client:

### Development URIs (Expo Go):
- exp://172.20.10.5:8081/--/redirect
- exp://172.20.10.5:8082/--/redirect
- exp://localhost:8081/--/redirect
- exp://localhost:8082/--/redirect
- exp://localhost:19000/--/redirect
- exp://localhost:19001/--/redirect
- exp://localhost:19002/--/redirect

### Expo Authentication Proxy:
- https://auth.expo.io/@relaxxyy/nusavarta

### Production URIs:
- com.banana.nusavarta://
- com.relaxxyy.nusavartagarudahacks://

### Custom Scheme:
- garudahacks60://

## How to Add:
1. Go to https://console.cloud.google.com/
2. Navigate to APIs & Services > Credentials
3. Click on your OAuth 2.0 Client ID
4. Scroll to "Authorized redirect URIs"
5. Click "ADD URI" and paste each URI above
6. Click "SAVE"

## Current Error URI:
The error shows: exp://172.20.10.5:8081/--/redirect
Add this exact URI to fix the immediate issue.
