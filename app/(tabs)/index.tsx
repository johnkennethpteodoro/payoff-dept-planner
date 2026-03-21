import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Colors, { Fonts } from "../../constants/colors";
import { getAllDebts, Debt } from "../../lib/database";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { getSettings } from "../../lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";

export default function Dashboard() {
	const [debts, setDebts] = useState<Debt[]>([]);
	const [userName, setUserName] = useState("");
	const [currencySymbol, setCurrencySymbol] = useState("₱");
	const [showDebts, setShowDebts] = useState(true); // ← new

	useFocusEffect(
		useCallback(() => {
			const data = getAllDebts();
			setDebts(data);
			getSettings().then((s) => {
				setUserName(s.userName);
				setCurrencySymbol(s.currencySymbol);
			});
		}, []),
	);

	const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
	const totalMinPayment = debts.reduce((sum, d) => sum + d.min_payment, 0);
	const monthsToFreedom = totalMinPayment > 0 ? Math.ceil(totalDebt / totalMinPayment) : 0;

	return (
		<View style={{ flex: 1, backgroundColor: Colors.background }}>
			<ScrollView
				style={{ flex: 1, backgroundColor: Colors.background }}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 90 }}
			>
				{/* Hero Card */}
				<LinearGradient
					colors={["#E53935", "#8B0000"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={{ borderRadius: 24 }}
				>
					<View style={{ marginHorizontal: 24, marginTop: 24 }}>
						{/* Top Row — Greeting + Badge */}
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "flex-start",
								marginBottom: 20,
							}}
						>
							<View>
								<Text
									style={{
										color: "rgba(255,255,255,0.95)",
										fontSize: 16,
										fontFamily: Fonts.semiBold,
									}}
								>
									{userName ? `Hi, ${userName}! 👋` : "Welcome! 👋"}
								</Text>
								<Text
									style={{
										color: "rgba(255,255,255,0.55)",
										fontSize: 12,
										fontFamily: Fonts.regular,
										marginTop: 3,
									}}
								>
									{new Date().toLocaleDateString("en-PH", {
										weekday: "long",
										month: "long",
										day: "numeric",
									})}
								</Text>
							</View>
							<View
								style={{
									backgroundColor: "rgba(255,255,255,0.2)",
									paddingHorizontal: 12,
									paddingVertical: 6,
									borderRadius: 20,
								}}
							>
								<Text
									style={{
										color: "white",
										fontSize: 12,
										fontFamily: Fonts.semiBold,
									}}
								>
									{debts.length} {debts.length === 1 ? "debt" : "debts"}
								</Text>
							</View>
						</View>

						{/* Total Debt */}
						<Text
							style={{
								color: "rgba(255,255,255,0.65)",
								fontSize: 12,
								fontFamily: Fonts.medium,
								letterSpacing: 1.5,
								textTransform: "uppercase",
							}}
						>
							Total Debt
						</Text>
						<Text
							style={{
								color: "white",
								fontSize: 44,
								fontFamily: Fonts.bold,
								marginTop: 4,
								letterSpacing: -1,
							}}
						>
							{currencySymbol}
							{totalDebt.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
						</Text>
					</View>

					{/* Divider */}
					<View
						style={{
							height: 1,
							backgroundColor: "rgba(255,255,255,0.1)",
							marginVertical: 16,
						}}
					/>

					{/* Bottom Stats */}
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginHorizontal: 24,
							marginBottom: 24,
						}}
					>
						<View>
							<Text
								style={{
									color: "rgba(255,255,255,0.65)",
									fontSize: 11,
									fontFamily: Fonts.medium,
									letterSpacing: 1,
									textTransform: "uppercase",
								}}
							>
								Monthly
							</Text>
							<Text
								style={{
									color: "white",
									fontSize: 20,
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
						<View style={{ alignItems: "flex-end" }}>
							<Text
								style={{
									color: "rgba(255,255,255,0.65)",
									fontSize: 11,
									fontFamily: Fonts.medium,
									letterSpacing: 1,
									textTransform: "uppercase",
								}}
							>
								Debt Free In
							</Text>
							<Text
								style={{
									color: "white",
									fontSize: 20,
									fontFamily: Fonts.bold,
									marginTop: 2,
								}}
							>
								{monthsToFreedom > 0 ? `${monthsToFreedom} mo.` : "--"}
							</Text>
						</View>
					</View>
				</LinearGradient>

				{/* Debt List */}
				{debts.length === 0 ? (
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
							<Ionicons name="wallet-outline" size={36} color={Colors.textLight} />
						</View>
						<Text
							style={{
								color: Colors.text,
								fontSize: 17,
								fontFamily: Fonts.semiBold,
								textAlign: "center",
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
							Tap the{" "}
							<Text style={{ color: Colors.primary, fontFamily: Fonts.semiBold }}>
								+ Add Debt
							</Text>{" "}
							button{"\n"}to add your first debt!
						</Text>
					</View>
				) : (
					<>
						{/* Collapsible Header */}
						<TouchableOpacity
							onPress={() => setShowDebts(!showDebts)}
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: Colors.textSecondary,
									fontSize: 11,
									fontFamily: Fonts.medium,
									letterSpacing: 1,
									textTransform: "uppercase",
								}}
							>
								Your Debts ({debts.length})
							</Text>
							<Ionicons
								name={showDebts ? "chevron-up" : "chevron-down"}
								size={16}
								color={Colors.textSecondary}
							/>
						</TouchableOpacity>

						{showDebts &&
							debts.map((debt) => (
								<TouchableOpacity
									key={debt.id}
									style={{
										backgroundColor: Colors.card,
										borderRadius: 16,
										padding: 16,
										borderWidth: 1,
										borderColor: Colors.border,
										flexDirection: "row",
										alignItems: "center",
										gap: 12,
									}}
									onPress={() => router.push("/debts")}
								>
									{/* Icon */}
									<View
										style={{
											width: 42,
											height: 42,
											borderRadius: 13,
											backgroundColor: Colors.primary + "20",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Ionicons
											name="card-outline"
											size={20}
											color={Colors.primary}
										/>
									</View>

									{/* Info */}
									<View style={{ flex: 1 }}>
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
												color: Colors.textSecondary,
												fontSize: 12,
												fontFamily: Fonts.regular,
												marginTop: 2,
											}}
										>
											{debt.interest_rate}% • {currencySymbol}
											{debt.min_payment} monthly
										</Text>
									</View>

									{/* Amount */}
									<View style={{ alignItems: "flex-end", gap: 2 }}>
										<Text
											style={{
												color: Colors.primary,
												fontSize: 15,
												fontFamily: Fonts.bold,
											}}
										>
											{currencySymbol}
											{debt.balance.toLocaleString("en-PH", {
												minimumFractionDigits: 0,
											})}
										</Text>
									</View>
								</TouchableOpacity>
							))}
					</>
				)}
			</ScrollView>

			{/* Floating Action Button */}
			<TouchableOpacity
				style={{
					position: "absolute",
					bottom: 24,
					right: 24,
					height: 52,
					borderRadius: 26,
					backgroundColor: Colors.primary,
					flexDirection: "row",
					alignItems: "center",
					paddingHorizontal: 20,
					gap: 5,
					elevation: 3,
				}}
				onPress={() => router.push("/add-debt")}
				activeOpacity={0.85}
			>
				<Text
					style={{
						color: "white",
						fontFamily: Fonts.bold,
						fontSize: 20,
						lineHeight: 22,
					}}
				>
					+
				</Text>
				<Text
					style={{
						color: "white",
						fontFamily: Fonts.semiBold,
						fontSize: 13,
						textTransform: "uppercase",
					}}
				>
					Add Debt
				</Text>
			</TouchableOpacity>
		</View>
	);
}
