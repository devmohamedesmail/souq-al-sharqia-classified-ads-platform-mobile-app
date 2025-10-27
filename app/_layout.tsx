import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useFonts as useGoogleFonts, Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css'
import '../i18n'; // Initialize i18n

// import { useColorScheme } from '@/components/useColorScheme';
import { useColorScheme } from 'react-native';
import AuthProvider from '@/context/auth_context';
import ToastManager from 'toastify-react-native'
import { NetworkProvider } from '@/context/NetworkProvider';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [expoFontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [googleFontsLoaded] = useGoogleFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });
  const allFontsLoaded = expoFontsLoaded && googleFontsLoaded;

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (allFontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [allFontsLoaded]);

  if (!allFontsLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (


    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <NetworkProvider>
          <Stack screenOptions={{ headerShown: false }}>

          </Stack>
          <ToastManager />
        </NetworkProvider>
      </AuthProvider>
    </ThemeProvider>


  );
}
