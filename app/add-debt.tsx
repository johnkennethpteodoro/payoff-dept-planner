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

// ─── Limits ───────────────────────────────────────────────────────────────────
const MAX_BALANCE = 99_999_999.99; // ₱99,999,999.99
const MAX_INTEREST = 100; // 100%
const MAX_MIN_PAYMENT = 99_999_999.99; // same ceiling as balance
const MAX_DECIMAL_PLACES = 2;
// ──────────────────────────────────────────────────────────────────────────────

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

	/**
	 * Sanitizes a decimal input string:
	 * - Strips non-numeric chars (except one dot)
	 * - Caps decimal places to MAX_DECIMAL_PLACES
	 * - BLOCKS input (returns previous value) if it would exceed maxValue
	 */
	const sanitizeDecimal = (text: string, prevRaw: string, maxValue?: number): string => {
		// Allow only digits and one decimal point
		let cleaned = text.replace(/[^0-9.]/g, "");

		// Only one decimal point allowed
		const dotIndex = cleaned.indexOf(".");
		if (dotIndex !== -1) {
			cleaned =
				cleaned.slice(0, dotIndex + 1) + cleaned.slice(dotIndex + 1).replace(/\./g, "");
		}

		// Limit decimal places — block extra digits silently
		if (dotIndex !== -1) {
			const decimals = cleaned.slice(dotIndex + 1);
			if (decimals.length > MAX_DECIMAL_PLACES) {
				return prevRaw; // block — don't accept the new character
			}
		}

		// Block if value exceeds maxValue — return previous value unchanged
		if (maxValue !== undefined && cleaned !== "" && cleaned !== ".") {
			const num = parseFloat(cleaned);
			if (!isNaN(num) && num > maxValue) {
				return prevRaw; // block — don't accept the new character
			}
		}

		return cleaned;
	};

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

	const handleBalanceChange = (text: string) => {
		const raw = sanitizeDecimal(unformatNumber(text), balance, MAX_BALANCE);
		setBalance(raw);
		setBalanceDisplay(formatNumber(raw));
	};

	const handleInterestChange = (text: string) => {
		const raw = sanitizeDecimal(text, interest, MAX_INTEREST);
		setInterest(raw);
	};

	const handleMinPaymentChange = (text: string) => {
		const raw = sanitizeDecimal(unformatNumber(text), minPayment, MAX_MIN_PAYMENT);
		setMinPayment(raw);
		setMinPaymentDisplay(formatNumber(raw));
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

		// Extra guard: min payment shouldn't exceed balance
		if (minPaymentNum > balanceNum) {
			Alert.alert(
				"Invalid Payment",
				"Minimum monthly payment cannot exceed the current balance.",
			);
			return;
		}

		if (interestNum <= 0) {
			Alert.alert("Invalid Interest", "Interest rate must be greater than 0%.");
			return;
		}

		// Guard: min payment must be greater than monthly interest accrued
		const monthlyInterest = (balanceNum * interestNum) / 100 / 12;
		if (minPaymentNum <= monthlyInterest) {
			Alert.alert(
				"Payment Too Low",
				`Your minimum payment (₱${minPaymentNum.toFixed(2)}) is less than or equal to the monthly interest (₱${monthlyInterest.toFixed(2)}). Your debt will never decrease.\n\nPlease enter a payment greater than ₱${monthlyInterest.toFixed(2)}.`,
			);
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
			keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
		>
			<ScrollView
				contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
				automaticallyAdjustKeyboardInsets={true}
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
									width: "48.5%",
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
							maxLength={50}
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
								onChangeText={handleBalanceChange}
								placeholder="0.00"
								placeholderTextColor={Colors.textLight}
								keyboardType="decimal-pad"
								maxLength={15} // "99,999,999.99" = 14 chars + buffer
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
								onChangeText={handleInterestChange}
								placeholder="0.00"
								placeholderTextColor={Colors.textLight}
								keyboardType="decimal-pad"
								maxLength={6} // "100.00"
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
							<Text style={{ color: Colors.textLight, fontSize: 11, marginTop: 4 }}>
								Max: 100%
							</Text>
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
								onChangeText={handleMinPaymentChange}
								placeholder="0.00"
								placeholderTextColor={Colors.textLight}
								keyboardType="decimal-pad"
								maxLength={15}
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
