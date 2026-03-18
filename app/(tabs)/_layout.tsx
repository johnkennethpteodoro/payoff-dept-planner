import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors, { Fonts } from "../../constants/colors";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.primary,
				tabBarInactiveTintColor: Colors.textLight,
				tabBarStyle: {
					backgroundColor: Colors.tabBar,
					borderTopColor: Colors.border,
					height: 80,
					paddingBottom: 16,
					paddingTop: 8,
				},
				tabBarLabelStyle: {
					fontFamily: Fonts.medium,
					fontSize: 10,
				},
				headerStyle: {
					backgroundColor: Colors.background,
				},
				headerTintColor: Colors.text,
				headerTitleStyle: {
					fontFamily: Fonts.semiBold,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Dashboard",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
					headerRight: () => (
						<TouchableOpacity
							onPress={() => router.push("/settings")}
							style={{ marginRight: 16 }}
						>
							<Ionicons name="settings-outline" size={24} color={Colors.text} />
						</TouchableOpacity>
					),
				}}
			/>
			<Tabs.Screen
				name="debts"
				options={{
					title: "My Debts",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="card-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="plan"
				options={{
					title: "Plan",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="analytics-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="coach"
				options={{
					title: "AI Coach",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="chatbubble-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="progress"
				options={{
					title: "Progress",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="trophy-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
