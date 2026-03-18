import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Colors, { Fonts } from "../../constants/colors";
import { getAllDebts, Debt } from "../../lib/database";

export default function Dashboard() {
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

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: Colors.background }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 40 }}
		>
			{/* Hero Card */}
			<View
				style={{
					margin: 16,
					padding: 28,
					backgroundColor: Colors.primary,
					borderRadius: 24,
				}}
			>
				<Text
					style={{
						color: "rgba(255,255,255,0.8)",
						fontSize: 13,
						fontFamily: Fonts.medium,
						letterSpacing: 1.2,
						textTransform: "uppercase",
					}}
				>
					Total Debt
				</Text>
				<Text
					style={{
						color: "white",
						fontSize: 42,
						fontFamily: Fonts.bold,
						marginTop: 6,
						letterSpacing: -1,
					}}
				>
					₱{totalDebt.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
				</Text>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginTop: 12,
						gap: 6,
					}}
				>
					<View
						style={{
							width: 6,
							height: 6,
							borderRadius: 3,
							backgroundColor: "rgba(255,255,255,0.6)",
						}}
					/>
					<Text
						style={{
							color: "rgba(255,255,255,0.7)",
							fontSize: 13,
							fontFamily: Fonts.regular,
						}}
					>
						{debts.length} {debts.length === 1 ? "debt" : "debts"} tracked
					</Text>
				</View>
			</View>

			{/* Stats Row */}
			<View style={{ flexDirection: "row", marginHorizontal: 16, gap: 12 }}>
				<View
					style={{
						flex: 1,
						padding: 18,
						backgroundColor: Colors.card,
						borderRadius: 16,
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
						Monthly
					</Text>
					<Text
						style={{
							color: Colors.text,
							fontSize: 22,
							fontFamily: Fonts.bold,
							marginTop: 6,
						}}
					>
						₱{totalMinPayment.toLocaleString("en-PH", { minimumFractionDigits: 0 })}
					</Text>
				</View>
				<View
					style={{
						flex: 1,
						padding: 18,
						backgroundColor: Colors.card,
						borderRadius: 16,
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
						Debt Free
					</Text>
					<Text
						style={{
							color: Colors.text,
							fontSize: 22,
							fontFamily: Fonts.bold,
							marginTop: 6,
						}}
					>
						{monthsToFreedom > 0 ? `${monthsToFreedom} mo.` : "--"}
					</Text>
				</View>
			</View>

			{/* Add Button */}
			<TouchableOpacity
				style={{
					margin: 16,
					padding: 18,
					backgroundColor: Colors.primary,
					borderRadius: 16,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: 8,
				}}
				onPress={() => router.push("/add-debt")}
			>
				<Ionicons name="add-circle-outline" size={22} color="white" />
				<Text
					style={{
						color: "white",
						fontSize: 16,
						fontFamily: Fonts.semiBold,
					}}
				>
					Add New Debt
				</Text>
			</TouchableOpacity>

			{/* Debt List */}
			<View style={{ marginHorizontal: 16, gap: 12 }}>
				{debts.length === 0 ? (
					<View style={{ alignItems: "center", marginTop: 32, padding: 24 }}>
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
							<Ionicons name="wallet-outline" size={40} color={Colors.textLight} />
						</View>
						<Text
							style={{
								color: Colors.text,
								fontSize: 18,
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
							Add your first debt to start{"\n"}your payoff journey!
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
							Your Debts
						</Text>
						{debts.map((debt) => (
							<View
								key={debt.id}
								style={{
									backgroundColor: Colors.card,
									borderRadius: 16,
									padding: 18,
									borderWidth: 1,
									borderColor: Colors.border,
								}}
							>
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
												color: Colors.textSecondary,
												fontSize: 13,
												fontFamily: Fonts.regular,
												marginTop: 4,
											}}
										>
											{debt.interest_rate}% • ₱{debt.min_payment}/mo min
										</Text>
									</View>
									<Text
										style={{
											color: Colors.primary,
											fontSize: 18,
											fontFamily: Fonts.bold,
										}}
									>
										₱
										{debt.balance.toLocaleString("en-PH", {
											minimumFractionDigits: 2,
										})}
									</Text>
								</View>
							</View>
						))}
					</>
				)}
			</View>
			<View style={{ height: 32 }} />
		</ScrollView>
	);
}
