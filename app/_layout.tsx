import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearAllDebts, initDatabase } from "../lib/database";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import {
	useFonts,
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
} from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
	});

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
			initDatabase();
			checkFirstLaunch();
		}
	}, [fontsLoaded]);

	const checkFirstLaunch = async () => {
		const hasLaunched = await AsyncStorage.getItem("hasLaunched");
		if (!hasLaunched) {
			clearAllDebts();
			await AsyncStorage.setItem("hasLaunched", "true");
			router.replace("/onboarding");
		}
	};

	if (!fontsLoaded) return null;

	return (
		<>
			<StatusBar style="light" />
			<Stack initialRouteName="(tabs)">
				<Stack.Screen name="onboarding" options={{ headerShown: false }} />
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen
					name="add-debt"
					options={{
						title: "Add Debt",
						presentation: "modal",
						headerBackButtonDisplayMode: "minimal",
						headerStyle: { backgroundColor: "#1A1A1A" },
						headerTintColor: "#FFFFFF",
						headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
					}}
				/>
				<Stack.Screen
					name="settings"
					options={{
						title: "Settings",
						headerBackButtonDisplayMode: "minimal",
						headerStyle: { backgroundColor: "#1A1A1A" },
						headerTintColor: "#FFFFFF",
						headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
					}}
				/>
				<Stack.Screen
					name="privacy-policy"
					options={{
						title: "Privacy Policy",
						headerBackButtonDisplayMode: "minimal",
						headerStyle: { backgroundColor: "#1A1A1A" },
						headerTintColor: "#FFFFFF",
						headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
					}}
				/>
				<Stack.Screen
					name="terms"
					options={{
						title: "Terms of Use",
						headerBackButtonDisplayMode: "minimal",
						headerStyle: { backgroundColor: "#1A1A1A" },
						headerTintColor: "#FFFFFF",
						headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
					}}
				/>
			</Stack>
		</>
	);
}
