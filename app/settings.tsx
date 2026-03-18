import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import Colors, { Fonts } from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
	const [notifications, setNotifications] = useState(false);

	const handleClearData = () => {
		Alert.alert(
			"Clear All Data",
			"This will delete all your debts and reset the app. This cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Clear All",
					style: "destructive",
					onPress: async () => {
						await AsyncStorage.clear();
						Alert.alert("Done", "All data cleared. Restart the app.", [
							{ text: "OK", onPress: () => router.replace("/onboarding") },
						]);
					},
				},
			],
		);
	};

	const SettingRow = ({ icon, label, value, onPress, danger = false, right }: any) => (
		<TouchableOpacity
			onPress={onPress}
			style={{
				flexDirection: "row",
				alignItems: "center",
				padding: 16,
				backgroundColor: Colors.card,
				borderRadius: 14,
				borderWidth: 1,
				borderColor: Colors.border,
				gap: 14,
			}}
		>
			<View
				style={{
					width: 38,
					height: 38,
					borderRadius: 10,
					backgroundColor: danger ? Colors.danger + "20" : Colors.card2,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Ionicons
					name={icon}
					size={20}
					color={danger ? Colors.danger : Colors.textSecondary}
				/>
			</View>
			<Text
				style={{
					flex: 1,
					color: danger ? Colors.danger : Colors.text,
					fontSize: 15,
					fontFamily: Fonts.medium,
				}}
			>
				{label}
			</Text>
			{right || <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />}
		</TouchableOpacity>
	);

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: Colors.background }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
		>
			{/* App Info */}
			<View
				style={{
					backgroundColor: Colors.card,
					borderRadius: 20,
					padding: 24,
					alignItems: "center",
					borderWidth: 1,
					borderColor: Colors.border,
					marginBottom: 8,
				}}
			>
				<View
					style={{
						width: 72,
						height: 72,
						borderRadius: 20,
						backgroundColor: Colors.primary,
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 12,
					}}
				>
					<Ionicons name="wallet" size={36} color="white" />
				</View>
				<Text
					style={{
						color: Colors.text,
						fontSize: 20,
						fontFamily: Fonts.bold,
					}}
				>
					Payoff
				</Text>
				<Text
					style={{
						color: Colors.textSecondary,
						fontSize: 13,
						fontFamily: Fonts.regular,
						marginTop: 4,
					}}
				>
					Debt Planner v1.0.0
				</Text>
			</View>

			{/* Preferences */}
			<Text
				style={{
					color: Colors.textSecondary,
					fontSize: 11,
					fontFamily: Fonts.medium,
					letterSpacing: 0.8,
					textTransform: "uppercase",
					marginTop: 8,
				}}
			>
				Preferences
			</Text>

			<SettingRow
				icon="notifications-outline"
				label="Payment Reminders"
				right={
					<Switch
						value={notifications}
						onValueChange={setNotifications}
						trackColor={{ false: Colors.border, true: Colors.primary }}
						thumbColor="white"
					/>
				}
			/>

			<SettingRow
				icon="cash-outline"
				label="Currency"
				onPress={() => Alert.alert("Currency", "Currently set to Philippine Peso (₱)")}
			/>

			{/* About */}
			<Text
				style={{
					color: Colors.textSecondary,
					fontSize: 11,
					fontFamily: Fonts.medium,
					letterSpacing: 0.8,
					textTransform: "uppercase",
					marginTop: 8,
				}}
			>
				About
			</Text>

			<SettingRow
				icon="star-outline"
				label="Rate Payoff"
				onPress={() => Alert.alert("Rate Us", "Thank you for using Payoff!")}
			/>

			<SettingRow
				icon="share-outline"
				label="Share App"
				onPress={() => Alert.alert("Share", "Share Payoff with friends!")}
			/>

			<SettingRow
				icon="document-text-outline"
				label="Privacy Policy"
				onPress={() =>
					Alert.alert(
						"Privacy Policy",
						"Your data stays on your device. We never collect personal information.",
					)
				}
			/>

			{/* Danger Zone */}
			<Text
				style={{
					color: Colors.textSecondary,
					fontSize: 11,
					fontFamily: Fonts.medium,
					letterSpacing: 0.8,
					textTransform: "uppercase",
					marginTop: 8,
				}}
			>
				Danger Zone
			</Text>

			<SettingRow
				icon="trash-outline"
				label="Clear All Data"
				onPress={handleClearData}
				danger
			/>
		</ScrollView>
	);
}
