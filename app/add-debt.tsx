import Colors, { Fonts } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { addDebt } from "../lib/database";
import { router } from "expo-router";
import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from "react-native";

const DEBT_CATEGORIES = [
	{ label: "Credit Card", icon: "card-outline" },
	{ label: "Car Loan", icon: "car-outline" },
	{ label: "Personal Loan", icon: "person-outline" },
	{ label: "Student Loan", icon: "school-outline" },
	{ label: "Mortgage", icon: "home-outline" },
	{ label: "Medical Bill", icon: "medical-outline" },
	{ label: "Business Loan", icon: "briefcase-outline" },
	{ label: "Other", icon: "ellipsis-horizontal-outline" },
];

export default function AddDebt() {
	const [name, setName] = useState("");
	const [balance, setBalance] = useState("");
	const [balanceDisplay, setBalanceDisplay] = useState("");
	const [minPayment, setMinPayment] = useState("");
	const [minPaymentDisplay, setMinPaymentDisplay] = useState("");
	const [interest, setInterest] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [showCustom, setShowCustom] = useState(false);

	const formatNumber = (value: string): string => {
		const cleaned = value.replace(/,/g, "");
		if (isNaN(Number(cleaned))) return value;
		if (cleaned === "") return "";
		const parts = cleaned.split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	};

	const unformatNumber = (value: string): string => value.replace(/,/g, "");

	const handleCategorySelect = (label: string) => {
		setSelectedCategory(label);
		if (label === "Other") {
			setShowCustom(true);
			setName("");
		} else {
			setShowCustom(false);
			setName(label);
		}
	};

	const handleSave = () => {
		if (!name.trim() || !balance.trim() || !interest.trim() || !minPayment.trim()) {
			Alert.alert("Missing Fields", "Please fill in all fields.");
			return;
		}

		const balanceNum = parseFloat(balance);
		const interestNum = parseFloat(interest);
		const minPaymentNum = parseFloat(minPayment);

		if (isNaN(balanceNum) || isNaN(interestNum) || isNaN(minPaymentNum)) {
			Alert.alert("Invalid Input", "Please enter valid numbers.");
			return;
		}

		addDebt({
			name: name.trim(),
			balance: balanceNum,
			interest_rate: interestNum,
			min_payment: minPaymentNum,
		});

		Alert.alert("Success! 🎉", `"${name}" has been added!`, [
			{ text: "OK", onPress: () => router.back() },
		]);
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: Colors.background }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={90}
		>
			<ScrollView
				contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
			>
				{/* Step 1 — Pick Category */}
				<View>
					<Text
						style={{
							color: Colors.textSecondary,
							fontSize: 11,
							fontFamily: Fonts.medium,
							letterSpacing: 0.8,
							textTransform: "uppercase",
							marginBottom: 12,
						}}
					>
						What type of debt?
					</Text>

					<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
						{DEBT_CATEGORIES.map((cat) => (
							<TouchableOpacity
								key={cat.label}
								onPress={() => handleCategorySelect(cat.label)}
								style={{
									width: "48.5%", // 2 columns with gap
									flexDirection: "row",
									alignItems: "center",
									gap: 6,
									paddingHorizontal: 14,
									paddingVertical: 14,
									borderRadius: 16,
									borderWidth: 1.5,
									borderColor:
										selectedCategory === cat.label
											? Colors.primary
											: Colors.border,
									backgroundColor:
										selectedCategory === cat.label
											? Colors.primary + "15"
											: Colors.card,
								}}
							>
								<Ionicons
									name={cat.icon as any}
									size={16}
									color={
										selectedCategory === cat.label
											? Colors.primary
											: Colors.textSecondary
									}
								/>
								<Text
									style={{
										color:
											selectedCategory === cat.label
												? Colors.primary
												: Colors.textSecondary,
										fontSize: 13,
										fontFamily:
											selectedCategory === cat.label
												? Fonts.semiBold
												: Fonts.regular,
									}}
								>
									{cat.label}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Custom Name */}
				{showCustom && (
					<View>
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 11,
								fontFamily: Fonts.medium,
								letterSpacing: 0.8,
								textTransform: "uppercase",
								marginBottom: 8,
							}}
						>
							Custom Debt Name
						</Text>
						<TextInput
							value={name}
							onChangeText={setName}
							placeholder="e.g. Sari-sari store loan"
							placeholderTextColor={Colors.textLight}
							autoFocus
							style={{
								backgroundColor: Colors.card,
								padding: 16,
								borderRadius: 14,
								color: Colors.text,
								borderWidth: 1,
								borderColor: name ? Colors.primary : Colors.border,
								fontSize: 16,
								fontFamily: Fonts.regular,
							}}
						/>
					</View>
				)}

				{/* Step 2 — Debt Details */}
				{selectedCategory !== "" && (
					<>
						{/* Balance */}
						<View>
							<Text
								style={{
									color: Colors.textSecondary,
									fontSize: 11,
									fontFamily: Fonts.medium,
									letterSpacing: 0.8,
									textTransform: "uppercase",
									marginBottom: 8,
								}}
							>
								Current Balance
							</Text>
							<TextInput
								value={balanceDisplay}
								onChangeText={(text) => {
									const raw = unformatNumber(text);
									setBalance(raw);
									setBalanceDisplay(formatNumber(raw));
								}}
								placeholder="0.00"
								placeholderTextColor={Colors.textLight}
								keyboardType="decimal-pad"
								style={{
									backgroundColor: Colors.card,
									padding: 14,
									borderRadius: 14,
									color: Colors.text,
									borderWidth: 1,
									borderColor: balance ? Colors.primary : Colors.border,
									fontSize: 16,
									fontFamily: Fonts.regular,
								}}
							/>
						</View>

						{/* Interest Rate */}
						<View>
							<Text
								style={{
									color: Colors.textSecondary,
									fontSize: 11,
									fontFamily: Fonts.medium,
									letterSpacing: 0.8,
									textTransform: "uppercase",
									marginBottom: 8,
								}}
							>
								Interest Rate (%)
							</Text>
							<TextInput
								value={interest}
								onChangeText={setInterest}
								placeholder="0.00"
								placeholderTextColor={Colors.textLight}
								keyboardType="decimal-pad"
								style={{
									backgroundColor: Colors.card,
									padding: 14,
									borderRadius: 14,
									color: Colors.text,
									borderWidth: 1,
									borderColor: interest ? Colors.primary : Colors.border,
									fontSize: 16,
									fontFamily: Fonts.regular,
								}}
							/>
						</View>

						{/* Min Payment */}
						<View>
							<Text
								style={{
									color: Colors.textSecondary,
									fontSize: 11,
									fontFamily: Fonts.medium,
									letterSpacing: 0.8,
									textTransform: "uppercase",
									marginBottom: 8,
								}}
							>
								Min. Monthly Payment
							</Text>
							<TextInput
								value={minPaymentDisplay}
								onChangeText={(text) => {
									const raw = unformatNumber(text);
									setMinPayment(raw);
									setMinPaymentDisplay(formatNumber(raw));
								}}
								placeholder="0.00"
								placeholderTextColor={Colors.textLight}
								keyboardType="decimal-pad"
								style={{
									backgroundColor: Colors.card,
									padding: 14,
									borderRadius: 14,
									color: Colors.text,
									borderWidth: 1,
									borderColor: minPayment ? Colors.primary : Colors.border,
									fontSize: 16,
									fontFamily: Fonts.regular,
								}}
							/>
						</View>

						<View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
							<TouchableOpacity
								style={{
									flex: 1,
									backgroundColor: Colors.card,
									padding: 15,
									borderRadius: 16,
									alignItems: "center",
									borderWidth: 1,
									borderColor: Colors.border,
								}}
								onPress={() => router.back()}
							>
								<Text
									style={{
										color: Colors.textSecondary,
										fontSize: 14,
										fontFamily: Fonts.regular,
									}}
								>
									Cancel
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={{
									flex: 1,
									backgroundColor: Colors.primary,
									padding: 15,
									borderRadius: 16,
									alignItems: "center",
								}}
								onPress={handleSave}
							>
								<Text
									style={{
										color: "white",
										fontSize: 14,
										fontFamily: Fonts.semiBold,
									}}
								>
									Save Debt
								</Text>
							</TouchableOpacity>
						</View>
					</>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
