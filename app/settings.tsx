import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from "react-native";
import { getSettings, saveSettings, currencies, AppSettings } from "../lib/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllDebts, clearAllDebts } from "../lib/database";
import Colors, { Fonts } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Image } from "react-native";
import { router } from "expo-router";

export default function Settings() {
	const [settings, setSettings] = useState<AppSettings>({
		userName: "",
		currency: "PHP",
		currencySymbol: "₱",
		strategy: "snowball",
		darkMode: true,
		notifications: false,
	});
	const [showCurrencyModal, setShowCurrencyModal] = useState(false);
	const [showNameModal, setShowNameModal] = useState(false);
	const [tempName, setTempName] = useState("");

	useEffect(() => {
		loadSettings();
	}, []);

	const loadSettings = async () => {
		const s = await getSettings();
		setSettings(s);
		setTempName(s.userName);
	};

	const updateSetting = async (key: keyof AppSettings, value: any) => {
		const updated = { ...settings, [key]: value };
		setSettings(updated);
		await saveSettings(updated);
	};

	const handleExportCSV = () => {
		const debts = getAllDebts();
		if (debts.length === 0) {
			Alert.alert("No Data", "Add some debts first before exporting.");
			return;
		}
		const csv = [
			"Name,Balance,Interest Rate,Min Payment,Added Date",
			...debts.map(
				(d) =>
					`${d.name},${d.balance},${d.interest_rate}%,${d.min_payment},${d.created_at}`,
			),
		].join("\n");

		Alert.alert("Export Data", `Your debt data:\n\n${csv}`, [{ text: "OK" }]);
	};

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
						clearAllDebts();
						await AsyncStorage.clear();
						Alert.alert("Done", "All data cleared.", [
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
			activeOpacity={onPress ? 0.7 : 1}
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
			<View style={{ flex: 1 }}>
				<Text
					style={{
						color: danger ? Colors.danger : Colors.text,
						fontSize: 15,
						fontFamily: Fonts.medium,
					}}
				>
					{label}
				</Text>
				{value && (
					<Text
						style={{
							color: Colors.textSecondary,
							fontSize: 12,
							fontFamily: Fonts.regular,
							marginTop: 2,
						}}
					>
						{value}
					</Text>
				)}
			</View>
			{right ||
				(onPress && <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />)}
		</TouchableOpacity>
	);

	return (
		<>
			<ScrollView
				style={{ flex: 1, backgroundColor: Colors.background }}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 60 }}
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
					<Image
						source={require("../assets/icon.png")}
						style={{
							width: 72,
							height: 72,
							borderRadius: 20,
							marginBottom: 12,
						}}
					/>
					<Text
						style={{
							color: Colors.text,
							fontSize: 20,
							fontFamily: Fonts.bold,
						}}
					>
						{settings.userName ? `Hi, ${settings.userName}! 👋` : "Payoff"}
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

				{/* Profile */}
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
					Profile
				</Text>

				<SettingRow
					icon="person-outline"
					label="Your Name"
					value={settings.userName || "Tap to set your name"}
					onPress={() => setShowNameModal(true)}
				/>

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
					icon="cash-outline"
					label="Currency"
					value={`${settings.currency} (${settings.currencySymbol})`}
					onPress={() => setShowCurrencyModal(true)}
				/>

				{/* Data */}
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
					Data
				</Text>

				<SettingRow
					icon="download-outline"
					label="Export Data as CSV"
					onPress={handleExportCSV}
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

			{/* Currency Modal */}
			<Modal
				visible={showCurrencyModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowCurrencyModal(false)}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.7)",
						justifyContent: "flex-end",
					}}
				>
					<View
						style={{
							backgroundColor: Colors.card,
							borderTopLeftRadius: 24,
							borderTopRightRadius: 24,
							padding: 24,
							gap: 12,
						}}
					>
						<Text
							style={{
								color: Colors.text,
								fontSize: 18,
								fontFamily: Fonts.bold,
								marginBottom: 8,
							}}
						>
							Select Currency
						</Text>

						{currencies.map((c) => (
							<TouchableOpacity
								key={c.value}
								onPress={() => {
									updateSetting("currency", c.value);
									updateSetting("currencySymbol", c.symbol);
									setShowCurrencyModal(false);
								}}
								style={{
									flexDirection: "row",
									alignItems: "center",
									padding: 14,
									backgroundColor:
										settings.currency === c.value
											? Colors.primary + "20"
											: Colors.card2,
									borderRadius: 12,
									borderWidth: 1,
									borderColor:
										settings.currency === c.value
											? Colors.primary
											: Colors.border,
									gap: 12,
								}}
							>
								<Text
									style={{
										color: Colors.text,
										fontSize: 18,
										fontFamily: Fonts.bold,
										width: 32,
									}}
								>
									{c.symbol}
								</Text>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											color: Colors.text,
											fontSize: 15,
											fontFamily: Fonts.medium,
										}}
									>
										{c.label}
									</Text>
									<Text
										style={{
											color: Colors.textSecondary,
											fontSize: 12,
											fontFamily: Fonts.regular,
										}}
									>
										{c.value}
									</Text>
								</View>
								{settings.currency === c.value && (
									<Ionicons
										name="checkmark-circle"
										size={22}
										color={Colors.primary}
									/>
								)}
							</TouchableOpacity>
						))}

						<TouchableOpacity
							onPress={() => setShowCurrencyModal(false)}
							style={{ padding: 16, alignItems: "center", marginTop: 8 }}
						>
							<Text
								style={{
									color: Colors.textSecondary,
									fontFamily: Fonts.medium,
									fontSize: 15,
								}}
							>
								Cancel
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Name Modal */}
			<Modal
				visible={showNameModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowNameModal(false)}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.7)",
						justifyContent: "flex-end",
					}}
				>
					<View
						style={{
							backgroundColor: Colors.card,
							borderTopLeftRadius: 24,
							borderTopRightRadius: 24,
							padding: 24,
							gap: 16,
						}}
					>
						<Text
							style={{
								color: Colors.text,
								fontSize: 18,
								fontFamily: Fonts.bold,
							}}
						>
							Your Name
						</Text>

						<TextInput
							value={tempName}
							onChangeText={setTempName}
							placeholder="Enter your name"
							placeholderTextColor={Colors.textLight}
							style={{
								backgroundColor: Colors.card2,
								padding: 16,
								borderRadius: 14,
								color: Colors.text,
								borderWidth: 1,
								borderColor: Colors.border,
								fontSize: 16,
								fontFamily: Fonts.regular,
							}}
						/>

						<TouchableOpacity
							onPress={() => {
								updateSetting("userName", tempName.trim());
								setShowNameModal(false);
							}}
							style={{
								backgroundColor: Colors.primary,
								padding: 16,
								borderRadius: 14,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "white",
									fontSize: 16,
									fontFamily: Fonts.semiBold,
								}}
							>
								Save
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => setShowNameModal(false)}
							style={{ alignItems: "center", padding: 8 }}
						>
							<Text
								style={{
									color: Colors.textSecondary,
									fontFamily: Fonts.medium,
									fontSize: 15,
								}}
							>
								Cancel
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
}
