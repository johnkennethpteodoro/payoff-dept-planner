import { View, Text, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Colors, { Fonts } from "../../constants/colors";
import { getAllDebts, Debt } from "../../lib/database";
import { Ionicons } from "@expo/vector-icons";

interface PayoffDebt extends Debt {
	monthsToPayoff: number;
	totalInterestPaid: number;
}

function calculatePayoff(debt: Debt): PayoffDebt {
	const monthlyRate = debt.interest_rate / 100 / 12;
	let balance = debt.balance;
	let months = 0;
	let totalInterest = 0;

	while (balance > 0 && months < 600) {
		const interest = balance * monthlyRate;
		totalInterest += interest;
		balance = balance + interest - debt.min_payment;
		if (balance < 0) balance = 0;
		months++;
	}

	return { ...debt, monthsToPayoff: months, totalInterestPaid: totalInterest };
}

export default function Plan() {
	const [debts, setDebts] = useState<PayoffDebt[]>([]);

	useFocusEffect(
		useCallback(() => {
			const data = getAllDebts();
			const calculated = data.map(calculatePayoff).sort((a, b) => a.balance - b.balance);
			setDebts(calculated);
		}, []),
	);

	const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
	const totalInterest = debts.reduce((sum, d) => sum + d.totalInterestPaid, 0);
	const maxMonths = debts.length > 0 ? Math.max(...debts.map((d) => d.monthsToPayoff)) : 0;

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: Colors.background }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 40 }}
		>
			<View style={{ padding: 16, gap: 16 }}>
				{/* Strategy Card */}
				<View
					style={{
						backgroundColor: Colors.card,
						borderRadius: 20,
						padding: 20,
						borderWidth: 1,
						borderColor: Colors.border,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 10,
							marginBottom: 10,
						}}
					>
						<View
							style={{
								width: 40,
								height: 40,
								borderRadius: 12,
								backgroundColor: Colors.primary,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Ionicons name="snow-outline" size={20} color="white" />
						</View>
						<Text
							style={{
								color: Colors.text,
								fontSize: 17,
								fontFamily: Fonts.bold,
							}}
						>
							Snowball Strategy
						</Text>
					</View>
					<Text
						style={{
							color: Colors.textSecondary,
							fontSize: 14,
							fontFamily: Fonts.regular,
							lineHeight: 22,
						}}
					>
						Pay off smallest debts first to build momentum. Each paid debt frees up
						money for the next one.
					</Text>
				</View>

				{/* Summary Stats */}
				<View style={{ flexDirection: "row", gap: 12 }}>
					<View
						style={{
							flex: 1,
							backgroundColor: Colors.card,
							borderRadius: 16,
							padding: 16,
							borderWidth: 1,
							borderColor: Colors.border,
						}}
					>
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 11,
								fontFamily: Fonts.medium,
								letterSpacing: 0.8,
								textTransform: "uppercase",
							}}
						>
							Debt Free In
						</Text>
						<Text
							style={{
								color: Colors.primary,
								fontSize: 26,
								fontFamily: Fonts.bold,
								marginTop: 6,
							}}
						>
							{maxMonths > 0 ? `${maxMonths} mo.` : "--"}
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							backgroundColor: Colors.card,
							borderRadius: 16,
							padding: 16,
							borderWidth: 1,
							borderColor: Colors.border,
						}}
					>
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 11,
								fontFamily: Fonts.medium,
								letterSpacing: 0.8,
								textTransform: "uppercase",
							}}
						>
							Total Interest
						</Text>
						<Text
							style={{
								color: Colors.text,
								fontSize: 26,
								fontFamily: Fonts.bold,
								marginTop: 6,
							}}
						>
							₱{totalInterest.toFixed(0)}
						</Text>
					</View>
				</View>

				{/* Payoff Order */}
				{debts.length === 0 ? (
					<View style={{ alignItems: "center", marginTop: 48 }}>
						<View
							style={{
								width: 80,
								height: 80,
								borderRadius: 40,
								backgroundColor: Colors.card,
								alignItems: "center",
								justifyContent: "center",
								marginBottom: 16,
							}}
						>
							<Ionicons name="analytics-outline" size={40} color={Colors.textLight} />
						</View>
						<Text
							style={{
								color: Colors.text,
								fontSize: 18,
								fontFamily: Fonts.semiBold,
								textAlign: "center",
							}}
						>
							No plan yet
						</Text>
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 14,
								fontFamily: Fonts.regular,
								textAlign: "center",
								marginTop: 8,
								lineHeight: 22,
							}}
						>
							Add debts to see your{"\n"}personalized payoff plan!
						</Text>
					</View>
				) : (
					<>
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 11,
								fontFamily: Fonts.medium,
								letterSpacing: 0.8,
								textTransform: "uppercase",
							}}
						>
							Payoff Order
						</Text>

						{debts.map((debt, index) => (
							<View
								key={debt.id}
								style={{
									backgroundColor: Colors.card,
									borderRadius: 16,
									padding: 18,
									borderWidth: 1,
									borderColor: index === 0 ? Colors.primary : Colors.border,
								}}
							>
								<View
									style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
								>
									<View
										style={{
											width: 36,
											height: 36,
											borderRadius: 12,
											backgroundColor:
												index === 0 ? Colors.primary : Colors.card2,
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Text
											style={{
												color: "white",
												fontFamily: Fonts.bold,
												fontSize: 15,
											}}
										>
											{index + 1}
										</Text>
									</View>
									<View style={{ flex: 1 }}>
										<Text
											style={{
												color: Colors.text,
												fontSize: 16,
												fontFamily: Fonts.semiBold,
											}}
										>
											{debt.name}
										</Text>
										<Text
											style={{
												color: Colors.textSecondary,
												fontSize: 13,
												fontFamily: Fonts.regular,
												marginTop: 2,
											}}
										>
											₱
											{debt.balance.toLocaleString("en-PH", {
												minimumFractionDigits: 2,
											})}
										</Text>
									</View>
									<View style={{ alignItems: "flex-end" }}>
										<Text
											style={{
												color: Colors.primary,
												fontSize: 16,
												fontFamily: Fonts.bold,
											}}
										>
											{debt.monthsToPayoff} mo.
										</Text>
										<Text
											style={{
												color: Colors.textSecondary,
												fontSize: 12,
												fontFamily: Fonts.regular,
												marginTop: 2,
											}}
										>
											₱{debt.totalInterestPaid.toFixed(0)} interest
										</Text>
									</View>
								</View>

								{/* Progress Bar */}
								<View
									style={{
										height: 4,
										backgroundColor: Colors.border,
										borderRadius: 2,
										marginTop: 14,
									}}
								>
									<View
										style={{
											height: 4,
											backgroundColor:
												index === 0 ? Colors.primary : Colors.textLight,
											borderRadius: 2,
											width: `${Math.min((debt.min_payment / debt.balance) * 100 * 10, 100)}%`,
										}}
									/>
								</View>
							</View>
						))}
					</>
				)}
			</View>
		</ScrollView>
	);
}
