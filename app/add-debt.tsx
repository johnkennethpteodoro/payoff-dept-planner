import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import Colors from "../constants/colors";
import { addDebt } from "../lib/database";

export default function AddDebt() {
	const [name, setName] = useState("");
	const [balance, setBalance] = useState("");
	const [interest, setInterest] = useState("");
	const [minPayment, setMinPayment] = useState("");

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

		Alert.alert("Success!", "Debt added successfully!", [
			{ text: "OK", onPress: () => router.back() },
		]);
	};

	return (
		<ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
			<View style={{ padding: 16, gap: 16 }}>
				<Text
					style={{
						color: Colors.text,
						fontSize: 24,
						fontWeight: "bold",
						marginBottom: 8,
					}}
				>
					Add New Debt
				</Text>

				{/* Debt Name */}
				<View>
					<Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 8 }}>
						DEBT NAME
					</Text>
					<TextInput
						value={name}
						onChangeText={setName}
						placeholder="e.g. Credit Card, Car Loan"
						placeholderTextColor={Colors.textLight}
						style={{
							backgroundColor: Colors.card,
							padding: 14,
							borderRadius: 10,
							color: Colors.text,
							borderWidth: 1,
							borderColor: Colors.border,
							fontSize: 16,
						}}
					/>
				</View>

				{/* Balance */}
				<View>
					<Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 8 }}>
						CURRENT BALANCE (₱)
					</Text>
					<TextInput
						value={balance}
						onChangeText={setBalance}
						placeholder="0.00"
						placeholderTextColor={Colors.textLight}
						keyboardType="decimal-pad"
						style={{
							backgroundColor: Colors.card,
							padding: 14,
							borderRadius: 10,
							color: Colors.text,
							borderWidth: 1,
							borderColor: Colors.border,
							fontSize: 16,
						}}
					/>
				</View>

				{/* Interest Rate */}
				<View>
					<Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 8 }}>
						INTEREST RATE (%)
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
							borderRadius: 10,
							color: Colors.text,
							borderWidth: 1,
							borderColor: Colors.border,
							fontSize: 16,
						}}
					/>
				</View>

				{/* Minimum Payment */}
				<View>
					<Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 8 }}>
						MIN. MONTHLY PAYMENT (₱)
					</Text>
					<TextInput
						value={minPayment}
						onChangeText={setMinPayment}
						placeholder="0.00"
						placeholderTextColor={Colors.textLight}
						keyboardType="decimal-pad"
						style={{
							backgroundColor: Colors.card,
							padding: 14,
							borderRadius: 10,
							color: Colors.text,
							borderWidth: 1,
							borderColor: Colors.border,
							fontSize: 16,
						}}
					/>
				</View>

				{/* Save Button */}
				<TouchableOpacity
					style={{
						backgroundColor: Colors.primary,
						padding: 16,
						borderRadius: 12,
						alignItems: "center",
						marginTop: 8,
					}}
					onPress={handleSave}
				>
					<Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
						Save Debt
					</Text>
				</TouchableOpacity>

				{/* Cancel */}
				<TouchableOpacity
					style={{ alignItems: "center", padding: 8 }}
					onPress={() => router.back()}
				>
					<Text style={{ color: Colors.textSecondary }}>Cancel</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}
