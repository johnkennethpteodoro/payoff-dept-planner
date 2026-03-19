import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Colors, { Fonts } from "../../constants/colors";
import { getAllDebts, getPaidDebts, deleteDebt, markDebtAsPaid, Debt } from "../../lib/database";
import { getSettings } from "../../lib/storage";

export default function Debts() {
	const [debts, setDebts] = useState<Debt[]>([]);
	const [paidDebts, setPaidDebts] = useState<Debt[]>([]);
	const [currencySymbol, setCurrencySymbol] = useState("₱");
	const [showPaid, setShowPaid] = useState(false);

	useFocusEffect(
		useCallback(() => {
			loadDebts();
			getSettings().then((s) => setCurrencySymbol(s.currencySymbol));
		}, []),
	);

	const loadDebts = () => {
		setDebts(getAllDebts());
		setPaidDebts(getPaidDebts());
	};

	const handleMarkComplete = (id: number, name: string) => {
		Alert.alert("All Paid Off? 🎉", `Have you finished paying "${name}" completely?`, [
			{ text: "Not yet", style: "cancel" },
			{
				text: "Yes, done!",
				onPress: () => {
					markDebtAsPaid(id);
					loadDebts();
					Alert.alert("🎉 Amazing!", `"${name}" is complete! Keep going!`);
				},
			},
		]);
	};

	const handleDelete = (id: number, name: string) => {
		Alert.alert("Delete Debt", `Are you sure you want to delete "${name}"?`, [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					deleteDebt(id);
					loadDebts();
				},
			},
		]);
	};

	const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
	const totalMinPayment = debts.reduce((sum, d) => sum + d.min_payment, 0);

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: Colors.background }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 60 }}
		>
			{/* Hero Summary */}
			{debts.length > 0 && (
				<LinearGradient
					colors={["#E53935", "#8B0000"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={{ borderRadius: 24, padding: 24 }}
				>
					<Text
						style={{
							color: "rgba(255,255,255,0.65)",
							fontSize: 12,
							fontFamily: Fonts.medium,
							letterSpacing: 1.2,
							textTransform: "uppercase",
						}}
					>
						Total Balance
					</Text>
					<Text
						style={{
							color: "white",
							fontSize: 38,
							fontFamily: Fonts.bold,
							marginTop: 4,
							letterSpacing: -1,
						}}
					>
						{currencySymbol}
						{totalBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
					</Text>

					<View
						style={{
							height: 1,
							backgroundColor: "rgba(255,255,255,0.2)",
							marginVertical: 16,
						}}
					/>

					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
								Active
							</Text>
							<Text
								style={{
									color: "white",
									fontSize: 18,
									fontFamily: Fonts.bold,
									marginTop: 2,
								}}
							>
								{debts.length} debts
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
								Monthly Min
							</Text>
							<Text
								style={{
									color: "white",
									fontSize: 18,
									fontFamily: Fonts.bold,
									marginTop: 2,
								}}
							>
								{currencySymbol}
								{totalMinPayment.toLocaleString("en-PH", {
									minimumFractionDigits: 0,
								})}
							</Text>
						</View>
					</View>
				</LinearGradient>
			)}

			{/* Add Button */}
			<TouchableOpacity
				style={{
					backgroundColor: debts.length > 0 ? Colors.card : Colors.primary,
					padding: 16,
					borderRadius: 16,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: 8,
					borderWidth: debts.length > 0 ? 1 : 0,
					borderColor: Colors.border,
				}}
				onPress={() => router.push("/add-debt")}
			>
				<View
					style={{
						width: 26,
						height: 26,
						borderRadius: 8,
						backgroundColor:
							debts.length > 0 ? Colors.primary : "rgba(255,255,255,0.3)",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Ionicons name="add" size={16} color="white" />
				</View>
				<Text
					style={{
						color: debts.length > 0 ? Colors.text : "white",
						fontSize: 15,
						fontFamily: Fonts.semiBold,
					}}
				>
					Add New Debt
				</Text>
			</TouchableOpacity>

			{/* Empty State */}
			{debts.length === 0 && paidDebts.length === 0 ? (
				<View
					style={{
						alignItems: "center",
						paddingVertical: 48,
						paddingHorizontal: 24,
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
						<Ionicons name="card-outline" size={36} color={Colors.textLight} />
					</View>
					<Text
						style={{
							color: Colors.text,
							fontSize: 17,
							fontFamily: Fonts.semiBold,
						}}
					>
						No debts yet
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
						Tap the button above{"\n"}to add your first debt!
					</Text>
				</View>
			) : (
				<>
					{/* Active Debts */}
					{debts.length > 0 && (
						<>
							<Text
								style={{
									color: Colors.textSecondary,
									fontSize: 11,
									fontFamily: Fonts.medium,
									letterSpacing: 0.8,
									textTransform: "uppercase",
									marginTop: 4,
								}}
							>
								Active Debts
							</Text>

							{debts.map((debt) => (
								<View
									key={debt.id}
									style={{
										backgroundColor: Colors.card,
										borderRadius: 16,
										padding: 16,
										borderWidth: 1,
										borderColor: Colors.border,
									}}
								>
									{/* Top Row */}
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "flex-start",
										}}
									>
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
													color: Colors.primary,
													fontSize: 24,
													fontFamily: Fonts.bold,
													marginTop: 2,
													letterSpacing: -0.5,
												}}
											>
												{currencySymbol}
												{debt.balance.toLocaleString("en-PH", {
													minimumFractionDigits: 2,
												})}
											</Text>
										</View>
										<TouchableOpacity
											onPress={() => handleDelete(debt.id!, debt.name)}
											style={{
												backgroundColor: Colors.card2,
												padding: 8,
												borderRadius: 10,
											}}
										>
											<Ionicons
												name="trash-outline"
												size={18}
												color={Colors.danger}
											/>
										</TouchableOpacity>
									</View>

									{/* Details + Mark Complete */}
									<View
										style={{
											flexDirection: "row",
											gap: 16,
											marginTop: 10,
											paddingTop: 10,
											borderTopWidth: 1,
											borderTopColor: Colors.border,
											alignItems: "center",
										}}
									>
										<View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													gap: 4,
												}}
											>
												<Ionicons
													name="trending-up-outline"
													size={14}
													color={Colors.textSecondary}
												/>
												<Text
													style={{
														color: Colors.textSecondary,
														fontSize: 13,
														fontFamily: Fonts.regular,
													}}
												>
													{debt.interest_rate}%
												</Text>
											</View>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													gap: 4,
												}}
											>
												<Ionicons
													name="calendar-outline"
													size={14}
													color={Colors.textSecondary}
												/>
												<Text
													style={{
														color: Colors.textSecondary,
														fontSize: 13,
														fontFamily: Fonts.regular,
													}}
												>
													{currencySymbol}
													{debt.min_payment} month
												</Text>
											</View>
										</View>

										{/* Mark Complete Button */}
										<TouchableOpacity
											onPress={() => handleMarkComplete(debt.id!, debt.name)}
											style={{
												flexDirection: "row",
												alignItems: "center",
												gap: 4,
												backgroundColor: Colors.success + "15",
												paddingHorizontal: 10,
												paddingVertical: 6,
												borderRadius: 8,
												borderWidth: 1,
												borderColor: Colors.success + "40",
											}}
										>
											<Ionicons
												name="checkmark-circle-outline"
												size={14}
												color={Colors.success}
											/>
											<Text
												style={{
													color: Colors.success,
													fontSize: 12,
													fontFamily: Fonts.semiBold,
												}}
											>
												Mark Complete
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							))}
						</>
					)}

					{/* Completed Section */}
					{paidDebts.length > 0 && (
						<>
							<TouchableOpacity
								onPress={() => setShowPaid(!showPaid)}
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									marginTop: 4,
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
									Completed ({paidDebts.length}) ✓
								</Text>
								<Ionicons
									name={showPaid ? "chevron-up" : "chevron-down"}
									size={16}
									color={Colors.textSecondary}
								/>
							</TouchableOpacity>

							{showPaid &&
								paidDebts.map((debt) => (
									<View
										key={debt.id}
										style={{
											backgroundColor: Colors.card,
											borderRadius: 16,
											padding: 16,
											borderWidth: 1,
											borderColor: Colors.success + "40",
											opacity: 0.7,
										}}
									>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												gap: 12,
											}}
										>
											<View
												style={{
													width: 36,
													height: 36,
													borderRadius: 10,
													backgroundColor: Colors.success + "20",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Ionicons
													name="checkmark-circle"
													size={20}
													color={Colors.success}
												/>
											</View>
											<View style={{ flex: 1 }}>
												<Text
													style={{
														color: Colors.textSecondary,
														fontSize: 15,
														fontFamily: Fonts.semiBold,
														textDecorationLine: "line-through",
													}}
												>
													{debt.name}
												</Text>
												<Text
													style={{
														color: Colors.textLight,
														fontSize: 12,
														fontFamily: Fonts.regular,
														marginTop: 2,
													}}
												>
													{currencySymbol}
													{debt.balance.toLocaleString("en-PH", {
														minimumFractionDigits: 2,
													})}{" "}
													• Completed 🎉
												</Text>
											</View>
											<TouchableOpacity
												onPress={() => handleDelete(debt.id!, debt.name)}
											>
												<Ionicons
													name="trash-outline"
													size={16}
													color={Colors.textLight}
												/>
											</TouchableOpacity>
										</View>
									</View>
								))}
						</>
					)}
				</>
			)}
		</ScrollView>
	);
}
