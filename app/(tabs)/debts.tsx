import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Colors, { Fonts } from "../../constants/colors";
import { getAllDebts, deleteDebt, Debt } from "../../lib/database";

export default function Debts() {
	const [debts, setDebts] = useState<Debt[]>([]);

	useFocusEffect(
		useCallback(() => {
			loadDebts();
		}, []),
	);

	const loadDebts = () => {
		const data = getAllDebts();
		setDebts(data);
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

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: Colors.background }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 40 }}
		>
			<View style={{ padding: 16, gap: 12 }}>
				{/* Total Summary */}
				{debts.length > 0 && (
					<View
						style={{
							backgroundColor: Colors.card,
							borderRadius: 16,
							padding: 18,
							borderWidth: 1,
							borderColor: Colors.border,
							marginBottom: 4,
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
							Total Balance
						</Text>
						<Text
							style={{
								color: Colors.primary,
								fontSize: 32,
								fontFamily: Fonts.bold,
								marginTop: 4,
							}}
						>
							₱{totalBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
						</Text>
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 13,
								fontFamily: Fonts.regular,
								marginTop: 4,
							}}
						>
							{debts.length} {debts.length === 1 ? "debt" : "debts"} total
						</Text>
					</View>
				)}

				{/* Add Button */}
				<TouchableOpacity
					style={{
						backgroundColor: Colors.primary,
						padding: 16,
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
							fontSize: 15,
							fontFamily: Fonts.semiBold,
						}}
					>
						Add New Debt
					</Text>
				</TouchableOpacity>

				{/* Debt List */}
				{debts.length === 0 ? (
					<View style={{ alignItems: "center", marginTop: 48, padding: 24 }}>
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
							<Ionicons name="card-outline" size={40} color={Colors.textLight} />
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
							Tap the button above{"\n"}to add your first debt!
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
								marginTop: 8,
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
												fontSize: 17,
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
												marginTop: 4,
											}}
										>
											₱
											{debt.balance.toLocaleString("en-PH", {
												minimumFractionDigits: 2,
											})}
										</Text>
									</View>
									<TouchableOpacity
										onPress={() => handleDelete(debt.id!, debt.name)}
										style={{
											backgroundColor: Colors.card2,
											padding: 10,
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

								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										marginTop: 14,
										paddingTop: 14,
										borderTopWidth: 1,
										borderTopColor: Colors.border,
									}}
								>
									<View>
										<Text
											style={{
												color: Colors.textSecondary,
												fontSize: 11,
												fontFamily: Fonts.medium,
												letterSpacing: 0.8,
												textTransform: "uppercase",
											}}
										>
											Interest
										</Text>
										<Text
											style={{
												color: Colors.text,
												fontSize: 15,
												fontFamily: Fonts.semiBold,
												marginTop: 4,
											}}
										>
											{debt.interest_rate}%
										</Text>
									</View>
									<View>
										<Text
											style={{
												color: Colors.textSecondary,
												fontSize: 11,
												fontFamily: Fonts.medium,
												letterSpacing: 0.8,
												textTransform: "uppercase",
											}}
										>
											Min Payment
										</Text>
										<Text
											style={{
												color: Colors.text,
												fontSize: 15,
												fontFamily: Fonts.semiBold,
												marginTop: 4,
											}}
										>
											₱{debt.min_payment}/mo
										</Text>
									</View>
									<View>
										<Text
											style={{
												color: Colors.textSecondary,
												fontSize: 11,
												fontFamily: Fonts.medium,
												letterSpacing: 0.8,
												textTransform: "uppercase",
											}}
										>
											Added
										</Text>
										<Text
											style={{
												color: Colors.text,
												fontSize: 15,
												fontFamily: Fonts.semiBold,
												marginTop: 4,
											}}
										>
											{new Date(debt.created_at!).toLocaleDateString(
												"en-PH",
												{ month: "short", day: "numeric" },
											)}
										</Text>
									</View>
								</View>
							</View>
						))}
					</>
				)}
			</View>
		</ScrollView>
	);
}
