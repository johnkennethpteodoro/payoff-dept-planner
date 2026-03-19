import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Colors, { Fonts } from "../../constants/colors";
import { getAllDebts, Debt } from "../../lib/database";
import { router, useFocusEffect } from "expo-router";
import { getSettings } from "../../lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";

export default function Dashboard() {
	const [debts, setDebts] = useState<Debt[]>([]);
	const [userName, setUserName] = useState("");
	const [currencySymbol, setCurrencySymbol] = useState("₱");

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
		<ScrollView
			style={{ flex: 1, backgroundColor: Colors.background }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 60 }}
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
				{/* Top Row */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "flex-start",
						marginBottom: 16,
					}}
				>
					<View>
						<Text
							style={{
								color: "rgba(255,255,255,0.85)",
								fontSize: 14,
								fontFamily: Fonts.medium,
							}}
						>
							{userName ? `Hi, ${userName}! 👋` : "Welcome! 👋"}
						</Text>
						<Text
							style={{
								color: "rgba(255,255,255,0.5)",
								fontSize: 12,
								fontFamily: Fonts.regular,
								marginTop: 2,
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

				{/* Divider */}
				<View
					style={{
						height: 1,
						backgroundColor: "rgba(255,255,255,0.2)",
						marginVertical: 16,
					}}
				/>

				{/* Bottom Stats */}
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
								fontSize: 18,
								fontFamily: Fonts.bold,
								marginTop: 2,
							}}
						>
							{currencySymbol}
							{totalMinPayment.toLocaleString("en-PH", { minimumFractionDigits: 0 })}
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
								fontSize: 18,
								fontFamily: Fonts.bold,
								marginTop: 2,
							}}
						>
							{monthsToFreedom > 0 ? `${monthsToFreedom} mo.` : "--"}
						</Text>
					</View>
				</View>
			</View>

			{/* Add Button */}
			<TouchableOpacity
				style={{
					marginHorizontal: 16,
					marginBottom: 16,
					padding: 18,
					backgroundColor: Colors.card,
					borderRadius: 16,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: 8,
					borderWidth: 1,
					borderColor: Colors.border,
				}}
				onPress={() => router.push("/add-debt")}
			>
				<View
					style={{
						width: 28,
						height: 28,
						borderRadius: 8,
						backgroundColor: Colors.primary,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Ionicons name="add" size={18} color="white" />
				</View>
				<Text
					style={{
						color: Colors.text,
						fontSize: 15,
						fontFamily: Fonts.semiBold,
					}}
				>
					Add New Debt
				</Text>
			</TouchableOpacity>

			{/* Debt List */}
			<View style={{ marginHorizontal: 16, gap: 10 }}>
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
								letterSpacing: 1,
								textTransform: "uppercase",
								marginBottom: 4,
							}}
						>
							Your Debts
						</Text>

						{debts.map((debt) => (
							<TouchableOpacity
								key={debt.id}
								style={{
									backgroundColor: Colors.card,
									borderRadius: 16,
									padding: 18,
									borderWidth: 1,
									borderColor: Colors.border,
									flexDirection: "row",
									alignItems: "center",
									gap: 14,
								}}
								onPress={() => router.push("/debts")}
							>
								<View
									style={{
										width: 44,
										height: 44,
										borderRadius: 14,
										backgroundColor: Colors.primary + "20",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Ionicons
										name="card-outline"
										size={22}
										color={Colors.primary}
									/>
								</View>
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
											marginTop: 3,
										}}
									>
										{debt.interest_rate}% interest • {currencySymbol}
										{debt.min_payment}/mo min
									</Text>
								</View>
								<Text
									style={{
										color: Colors.primary,
										fontSize: 16,
										fontFamily: Fonts.bold,
									}}
								>
									{currencySymbol}
									{debt.balance.toLocaleString("en-PH", {
										minimumFractionDigits: 2,
									})}
								</Text>
							</TouchableOpacity>
						))}
					</>
				)}
			</View>
		</ScrollView>
	);
}
