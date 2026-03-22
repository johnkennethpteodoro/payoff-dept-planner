import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Colors, { Fonts } from "../../constants/colors";
import { getAllDebts, Debt } from "../../lib/database";
import { LinearGradient } from "expo-linear-gradient";
import { getSettings } from "../../lib/storage";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

interface ClimbDebt extends Debt {
	monthsToClimb: number;
	totalInterestPaid: number;
}

function calculateClimb(debt: Debt): ClimbDebt {
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
	return { ...debt, monthsToClimb: months, totalInterestPaid: totalInterest };
}

function getDebtFreeDate(months: number): string {
	if (months === 0) return "--";
	const date = new Date();
	date.setMonth(date.getMonth() + months);
	return date.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
}

export default function Plan() {
	const [debts, setDebts] = useState<ClimbDebt[]>([]);
	const [strategy, setStrategy] = useState<"snowball" | "avalanche">("snowball");
	const [currencySymbol, setCurrencySymbol] = useState("₱");

	useFocusEffect(
		useCallback(() => {
			const data = getAllDebts();
			getSettings().then((s) => {
				setCurrencySymbol(s.currencySymbol);
				applyStrategy(data, strategy);
			});
		}, [strategy]),
	);

	const applyStrategy = (data: Debt[], currentStrategy: string) => {
		const calculated = data.map(calculateClimb);
		if (currentStrategy === "snowball") {
			calculated.sort((a, b) => a.balance - b.balance);
		} else {
			calculated.sort((a, b) => b.interest_rate - a.interest_rate);
		}
		setDebts(calculated);
	};

	const handleStrategyChange = (newStrategy: "snowball" | "avalanche") => {
		setStrategy(newStrategy);
		const data = getAllDebts();
		applyStrategy(data, newStrategy);
	};

	const totalInterest = debts.reduce((sum, d) => sum + d.totalInterestPaid, 0);
	const totalMonthlyPayment = debts.reduce((sum, d) => sum + d.min_payment, 0);
	const maxMonths = debts.length > 0 ? Math.max(...debts.map((d) => d.monthsToClimb)) : 0;

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: Colors.background }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 60 }}
		>
			{/* Hero Summary Card */}
			<LinearGradient
				colors={["#E53935", "#8B0000"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={{
					borderRadius: 24,
				}}
			>
				<View style={{ marginHorizontal: 24, marginTop: 24 }}>
					{/* Top — Debt Free Date */}
					<Text
						style={{
							color: "rgba(255,255,255,0.65)",
							fontSize: 12,
							fontFamily: Fonts.medium,
							letterSpacing: 1.2,
							textTransform: "uppercase",
						}}
					>
						Debt Free By
					</Text>
					<Text
						style={{
							color: "white",
							fontSize: 28,
							fontFamily: Fonts.bold,
							marginTop: 4,
						}}
					>
						{maxMonths > 0 ? getDebtFreeDate(maxMonths) : "--"}
					</Text>
				</View>

				<View
					style={{
						height: 1,
						backgroundColor: "rgba(255,255,255,0.1)",
						marginVertical: 16,
					}}
				/>

				{/* Bottom Row */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginBottom: 24,
						marginHorizontal: 24,
					}}
				>
					<View>
						<Text
							style={{
								color: "rgba(255,255,255,0.65)",
								fontSize: 11,
								fontFamily: Fonts.medium,
								textTransform: "uppercase",
								letterSpacing: 1,
							}}
						>
							Monthly
						</Text>
						<Text
							style={{
								color: "white",
								fontSize: 20,
								fontFamily: Fonts.bold,
								marginTop: 4,
							}}
						>
							{currencySymbol}
							{totalMonthlyPayment.toLocaleString("en-PH", {
								minimumFractionDigits: 0,
							})}
						</Text>
					</View>

					<View style={{ alignItems: "flex-end" }}>
						<Text
							style={{
								color: "rgba(255,255,255,0.65)",
								fontSize: 11,
								fontFamily: Fonts.medium,
								textTransform: "uppercase",
								letterSpacing: 1,
							}}
						>
							Interest
						</Text>
						<Text
							style={{
								color: "rgba(255,255,255,0.9)",
								fontSize: 20,
								fontFamily: Fonts.bold,
								marginTop: 4,
							}}
						>
							{currencySymbol}
							{totalInterest.toLocaleString("en-PH", {
								minimumFractionDigits: 0,
								maximumFractionDigits: 0,
							})}
						</Text>
					</View>
				</View>
			</LinearGradient>

			{/* Strategy Toggle */}
			<View
				style={{
					flexDirection: "row",
					backgroundColor: Colors.card,
					borderRadius: 16,
					padding: 4,
					borderWidth: 1,
					borderColor: Colors.border,
				}}
			>
				<TouchableOpacity
					onPress={() => handleStrategyChange("snowball")}
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						gap: 6,
						padding: 12,
						borderRadius: 12,
						backgroundColor: strategy === "snowball" ? Colors.primary : "transparent",
					}}
				>
					<Ionicons
						name="snow-outline"
						size={16}
						color={strategy === "snowball" ? "white" : Colors.textSecondary}
					/>
					<Text
						style={{
							color: strategy === "snowball" ? "white" : Colors.textSecondary,
							fontSize: 13,
							fontFamily: Fonts.semiBold,
						}}
					>
						Snowball
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => handleStrategyChange("avalanche")}
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						gap: 6,
						padding: 12,
						borderRadius: 12,
						backgroundColor: strategy === "avalanche" ? Colors.primary : "transparent",
					}}
				>
					<Ionicons
						name="trending-down-outline"
						size={16}
						color={strategy === "avalanche" ? "white" : Colors.textSecondary}
					/>
					<Text
						style={{
							color: strategy === "avalanche" ? "white" : Colors.textSecondary,
							fontSize: 13,
							fontFamily: Fonts.semiBold,
						}}
					>
						Avalanche
					</Text>
				</TouchableOpacity>
			</View>

			{/* Strategy Tip */}
			<Text
				style={{
					color: Colors.textSecondary,
					fontSize: 13,
					fontFamily: Fonts.regular,
					textAlign: "center",
					lineHeight: 20,
				}}
			>
				{strategy === "snowball"
					? "❄️ Paying smallest debts first builds momentum"
					: "🏔️ Paying highest interest first saves more money"}
			</Text>

			{/* Climb Order */}
			{debts.length === 0 ? (
				<View
					style={{
						alignItems: "center",
						paddingVertical: 48,
						backgroundColor: Colors.card,
						borderRadius: 20,
						borderWidth: 1,
						borderColor: Colors.border,
					}}
				>
					<View
						style={{
							width: 72,
							height: 72,
							borderRadius: 36,
							backgroundColor: Colors.card2,
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 16,
						}}
					>
						<Ionicons name="analytics-outline" size={36} color={Colors.textLight} />
					</View>
					<Text
						style={{
							color: Colors.text,
							fontSize: 17,
							fontFamily: Fonts.semiBold,
						}}
					>
						No plan yet
					</Text>
					<Text
						style={{
							color: Colors.textSecondary,
							fontSize: 14,
							fontFamily: Fonts.regular,
							marginTop: 8,
							textAlign: "center",
							lineHeight: 22,
						}}
					>
						Add debts to see your{"\n"}personalized climb plan!
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
						Climb Order
					</Text>

					{debts.map((debt, index) => (
						<View
							key={debt.id}
							style={{
								backgroundColor: Colors.card,
								borderRadius: 16,
								padding: 16,
								borderWidth: 1,
								borderColor: index === 0 ? Colors.primary : Colors.border,
							}}
						>
							<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
								{/* Number */}
								<View
									style={{
										width: 36,
										height: 36,
										borderRadius: 10,
										backgroundColor:
											index === 0 ? Colors.primary : Colors.card2,
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Text
										style={{
											color: index === 0 ? "white" : Colors.textSecondary,
											fontFamily: Fonts.bold,
											fontSize: 15,
										}}
									>
										{index + 1}
									</Text>
								</View>

								{/* Name + Details */}
								<View style={{ flex: 1 }}>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<Text
											style={{
												color: Colors.text,
												fontSize: 15,
												fontFamily: Fonts.semiBold,
											}}
										>
											{debt.name}
										</Text>
										<Text
											style={{
												color: index === 0 ? Colors.primary : Colors.text,
												fontSize: 15,
												fontFamily: Fonts.bold,
											}}
										>
											{debt.monthsToClimb} mo.
										</Text>
									</View>

									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											marginTop: 4,
										}}
									>
										<Text
											style={{
												color: Colors.textSecondary,
												fontSize: 12,
												fontFamily: Fonts.regular,
											}}
										>
											{currencySymbol}
											{debt.balance.toLocaleString("en-PH", {
												minimumFractionDigits: 0,
											})}{" "}
											• {debt.interest_rate}%
										</Text>
										<Text
											style={{
												color: Colors.textSecondary,
												fontSize: 12,
												fontFamily: Fonts.regular,
											}}
										>
											{index === 0
												? "🎯 Pay this first"
												: getDebtFreeDate(debt.monthsToClimb)}
										</Text>
									</View>
								</View>
							</View>

							{/* Progress Bar */}
							<View
								style={{
									height: 3,
									backgroundColor: Colors.border,
									borderRadius: 2,
									marginTop: 12,
								}}
							>
								<View
									style={{
										height: 3,
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
		</ScrollView>
	);
}
