import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { AppProvider, useApp } from './lib/store';
import { fonts, Icon, Txt } from './components/UI';
import AppShell from './components/AppShell';
import CarDetailScreen from './screens/CarDetailScreen';
import SellCarScreen from './screens/SellCarScreen';
import { ChatScreen } from './screens/MessagesScreen';

const Stack = createNativeStackNavigator();
function Navigation() {
  const { theme, darkMode, toast } = useApp();
  return <View style={{ flex: 1, backgroundColor: theme.bg }}><StatusBar style={darkMode ? 'light' : 'dark'} /><NavigationContainer theme={{ ...(darkMode ? DarkTheme : DefaultTheme), colors: { ...(darkMode ? DarkTheme : DefaultTheme).colors, primary: theme.forest, background: theme.bg, card: theme.surface, text: theme.text, border: theme.border } }} documentTitle={{ formatter: () => 'Drivn — Find your next chapter' }}><Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: theme.bg } }}><Stack.Screen name="Main" component={AppShell} /><Stack.Screen name="CarDetail" component={CarDetailScreen} /><Stack.Screen name="SellCar" component={SellCarScreen} options={{ presentation: 'modal' }} /><Stack.Screen name="Chat" component={ChatScreen} /></Stack.Navigator></NavigationContainer>{!!toast && <Animated.View entering={FadeInUp.duration(220)} exiting={FadeOutDown.duration(170)} pointerEvents="none" style={{ position: 'absolute', bottom: 88, alignSelf: 'center', zIndex: 100, maxWidth: '90%', backgroundColor: '#233D2F', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 19, flexDirection: 'row', alignItems: 'center', gap: 10, shadowColor: '#000', shadowOpacity: .15, shadowRadius: 20, elevation: 10 }}><Icon name="checkmark-circle" color="#D4F580" size={20} /><Txt style={{ color: '#fff', fontSize: 12, fontFamily: fonts.medium, flexShrink: 1, lineHeight: 18 }}>{toast}</Txt></Animated.View>}</View>;
}
export default function App() {
  const [loaded, error] = useFonts({ ...Ionicons.font, DMRegular: DMSans_400Regular, DMMedium: DMSans_500Medium, DMSemibold: DMSans_600SemiBold, DMBold: DMSans_700Bold });
  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: '#F7F8F5', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#4D673E" /></View>;
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><AppProvider><Navigation /></AppProvider></SafeAreaProvider></GestureHandlerRootView>;
}

