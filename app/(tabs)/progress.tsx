import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Colors from "../../constants/colors";
import { getAllDebts, Debt } from "../../lib/database";

export default function Progress() {
	const [debts, setDebts] = useState<Debt[]>([]);

	useFocusEffect(
		useCallback(() => {
			const data = getAllDebts();
			setDebts(data);
		}, []),
	);

	const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
	const totalMinPayment = debts.reduce((sum, d) => sum + d.min_payment, 0);
	const monthsToFreedom = totalMinPayment > 0 ? Math.ceil(totalDebt / totalMinPayment) : 0;

	const milestones = [
		{ label: "Added first debt", icon: "flag-outline", done: debts.length > 0 },
		{ label: "Created payoff plan", icon: "analytics-outline", done: debts.length > 0 },
		{ label: "First debt paid off", icon: "checkmark-circle-outline", done: false },
		{ label: "Halfway there!", icon: "trending-up-outline", done: false },
		{ label: "Debt free! 🎉", icon: "trophy-outline", done: false },
	];

	return (
		<ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
			<View style={{ padding: 16, gap: 16 }}>
				{/* Header Card */}
				<View
					style={{
						backgroundColor: Colors.primary,
						borderRadius: 16,
						padding: 24,
						alignItems: "center",
					}}
				>
					<Ionicons name="trophy" size={48} color="white" />
					<Text
						style={{ color: "white", fontSize: 22, fontWeight: "bold", marginTop: 12 }}
					>
						Your Journey
					</Text>
					<Text style={{ color: "white", opacity: 0.8, fontSize: 14, marginTop: 4 }}>
						{debts.length > 0
							? `${monthsToFreedom} months to debt freedom!`
							: "Start by adding your debts!"}
					</Text>
				</View>

				{/* Stats */}
				<View style={{ flexDirection: "row", gap: 12 }}>
					<View
						style={{
							flex: 1,
							backgroundColor: Colors.card,
							borderRadius: 12,
							padding: 16,
							alignItems: "center",
						}}
					>
						<Text style={{ color: Colors.textSecondary, fontSize: 11 }}>
							TOTAL DEBTS
						</Text>
						<Text
							style={{
								color: Colors.primary,
								fontSize: 32,
								fontWeight: "bold",
								marginTop: 4,
							}}
						>
							{debts.length}
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							backgroundColor: Colors.card,
							borderRadius: 12,
							padding: 16,
							alignItems: "center",
						}}
					>
						<Text style={{ color: Colors.textSecondary, fontSize: 11 }}>
							DEBTS PAID
						</Text>
						<Text
							style={{
								color: Colors.primary,
								fontSize: 32,
								fontWeight: "bold",
								marginTop: 4,
							}}
						>
							0
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							backgroundColor: Colors.card,
							borderRadius: 12,
							padding: 16,
							alignItems: "center",
						}}
					>
						<Text style={{ color: Colors.textSecondary, fontSize: 11 }}>
							MONTHS LEFT
						</Text>
						<Text
							style={{
								color: Colors.primary,
								fontSize: 32,
								fontWeight: "bold",
								marginTop: 4,
							}}
						>
							{monthsToFreedom > 0 ? monthsToFreedom : "--"}
						</Text>
					</View>
				</View>

				{/* Milestones */}
				<Text style={{ color: Colors.textSecondary, fontSize: 13 }}>MILESTONES</Text>
				{milestones.map((milestone, index) => (
					<View
						key={index}
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 12,
							backgroundColor: Colors.card,
							borderRadius: 12,
							padding: 16,
							borderWidth: 1,
							borderColor: milestone.done ? Colors.primary : Colors.border,
						}}
					>
						<View
							style={{
								width: 40,
								height: 40,
								borderRadius: 20,
								backgroundColor: milestone.done ? Colors.primary : Colors.card2,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Ionicons
								name={milestone.icon as any}
								size={20}
								color={milestone.done ? "white" : Colors.textLight}
							/>
						</View>
						<Text
							style={{
								color: milestone.done ? Colors.text : Colors.textSecondary,
								fontSize: 15,
								fontWeight: milestone.done ? "600" : "400",
								flex: 1,
							}}
						>
							{milestone.label}
						</Text>
						{milestone.done && (
							<Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
						)}
					</View>
				))}

				<View style={{ height: 32 }} />
			</View>
		</ScrollView>
	);
}
