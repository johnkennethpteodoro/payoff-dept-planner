import Colors, { Fonts } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { getSettings } from "../../lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
	getAllDebts,
	getPaidDebts,
	deleteDebt,
	markDebtAsPaid,
	logPaymentWithHistory,
	Debt,
} from "../../lib/database";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Alert,
	TextInput,
	Modal,
	KeyboardAvoidingView,
	Platform,
} from "react-native";

export default function Debts() {
	const [debts, setDebts] = useState<Debt[]>([]);
	const [paidDebts, setPaidDebts] = useState<Debt[]>([]);
	const [currencySymbol, setCurrencySymbol] = useState("₱");
	const [showPaid, setShowPaid] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
	const [paymentAmount, setPaymentAmount] = useState(""); // raw numeric string e.g. "10000.50"
	const [paymentDisplay, setPaymentDisplay] = useState(""); // formatted display e.g. "10,000.50"
	const [paymentError, setPaymentError] = useState("");

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

	const handleLogPayment = (debt: Debt) => {
		setSelectedDebt(debt);
		const initial = debt.min_payment.toFixed(2);
		setPaymentAmount(initial);
		setPaymentDisplay(formatWithCommas(initial));
		setPaymentError("");
		setShowPaymentModal(true);
	};

	// Format a raw numeric string into comma-separated display string
	const formatWithCommas = (raw: string): string => {
		if (!raw) return "";
		const [intPart, decPart] = raw.split(".");
		const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
	};

	// Handles decimal-following input with live comma formatting
	const handleAmountChange = (text: string) => {
		// Strip commas to get raw input, keep only digits and one dot
		const stripped = text.replace(/,/g, "");
		const cleaned = stripped.replace(/[^0-9.]/g, "");

		// Prevent multiple dots
		const parts = cleaned.split(".");
		let raw = parts[0];
		if (parts.length > 1) {
			raw += "." + parts[1].slice(0, 2);
		}

		// Format integer part with commas for display
		const display = formatWithCommas(raw);

		setPaymentAmount(raw);
		setPaymentDisplay(display);

		// Validate against min/max
		const amount = parseFloat(raw);
		if (!raw || isNaN(amount)) {
			setPaymentError("");
			return;
		}

		const min = selectedDebt?.min_payment ?? 0;
		const max = selectedDebt?.balance ?? 0;

		if (amount < min) {
			setPaymentError(
				`Minimum payment is ${currencySymbol}${min.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
			);
		} else if (amount > max) {
			setPaymentError(
				`Maximum payment is ${currencySymbol}${max.toLocaleString("en-PH", { minimumFractionDigits: 2 })} (full balance)`,
			);
		} else {
			setPaymentError("");
		}
	};

	const handleSavePayment = () => {
		if (!selectedDebt) return;

		const amount = parseFloat(paymentAmount);
		if (!paymentAmount || isNaN(amount) || amount <= 0) {
			Alert.alert("Invalid Amount", "Please enter a valid payment amount.");
			return;
		}

		const min = selectedDebt.min_payment;
		const max = selectedDebt.balance;

		if (amount < min) {
			Alert.alert(
				"Below Minimum Payment",
				`The minimum payment for "${selectedDebt.name}" is ${currencySymbol}${min.toLocaleString("en-PH", { minimumFractionDigits: 2 })}. Please enter at least this amount.`,
			);
			return;
		}

		// If amount equals the full balance, mark as complete
		if (amount >= max) {
			Alert.alert(
				"Pay Off Completely?",
				`This will fully pay off "${selectedDebt.name}". Mark it as complete?`,
				[
					{ text: "Cancel", style: "cancel" },
					{
						text: "Mark Complete",
						onPress: () => {
							markDebtAsPaid(selectedDebt.id!);
							loadDebts();
							setShowPaymentModal(false);
							setPaymentAmount("");
							setPaymentDisplay("");
							setPaymentError("");
							Alert.alert(
								"🎉 Amazing!",
								`"${selectedDebt.name}" is complete! Keep going!`,
							);
						},
					},
				],
			);
			return;
		}

		logPaymentWithHistory(selectedDebt.id!, selectedDebt.name, amount);
		loadDebts();
		setShowPaymentModal(false);
		setPaymentAmount("");
		setPaymentDisplay("");
		setPaymentError("");

		const updatedDebt = getAllDebts().find((d) => d.id === selectedDebt.id);
		if (!updatedDebt) {
			Alert.alert("🎉 Amazing!", `"${selectedDebt.name}" is fully paid off!`);
		} else {
			Alert.alert(
				"Payment Logged! 💰",
				`${currencySymbol}${amount.toLocaleString()} paid on ${selectedDebt.name}.\nRemaining: ${currencySymbol}${updatedDebt.balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
				[{ text: "Great!" }],
			);
		}
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

	const parsedAmount = parseFloat(paymentAmount);
	const isValidAmount =
		paymentAmount !== "" &&
		!isNaN(parsedAmount) &&
		parsedAmount >= (selectedDebt?.min_payment ?? 0) &&
		parsedAmount <= (selectedDebt?.balance ?? Infinity);

	return (
		<>
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
						style={{ borderRadius: 24 }}
					>
						<View
							style={{
								marginHorizontal: 24,
								marginTop: 24,
							}}
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
						</View>
						<View
							style={{
								height: 1,
								backgroundColor: "rgba(255,255,255,0.1)",
								marginVertical: 16,
							}}
						/>
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
											borderWidth: 1,
											borderColor: Colors.border,
										}}
									>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
												alignItems: "flex-start",
												marginHorizontal: 16,
												marginTop: 16,
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

										<View
											style={{
												flexDirection: "row",
												gap: 12,
												marginTop: 10,
												paddingTop: 10,
												borderTopWidth: 1,
												borderTopColor: Colors.border,
												alignItems: "center",
											}}
										>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													gap: 4,
													marginHorizontal: 16,
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
													{debt.min_payment}/month
												</Text>
											</View>
										</View>

										<View
											style={{
												flexDirection: "row",
												gap: 8,
												marginTop: 10,
												marginHorizontal: 16,
												marginBottom: 16,
											}}
										>
											<TouchableOpacity
												onPress={() => handleLogPayment(debt)}
												style={{
													flex: 1,
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "center",
													gap: 4,
													backgroundColor: Colors.primary,
													paddingHorizontal: 12,
													paddingVertical: 10,
													borderRadius: 10,
												}}
											>
												<Ionicons
													name="cash-outline"
													size={14}
													color="white"
												/>
												<Text
													style={{
														color: "white",
														fontSize: 13,
														fontFamily: Fonts.semiBold,
													}}
												>
													Log Payment
												</Text>
											</TouchableOpacity>

											<TouchableOpacity
												onPress={() =>
													handleMarkComplete(debt.id!, debt.name)
												}
												style={{
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "center",
													gap: 4,
													backgroundColor: Colors.success + "15",
													paddingHorizontal: 12,
													paddingVertical: 10,
													borderRadius: 10,
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
														fontSize: 13,
														fontFamily: Fonts.semiBold,
													}}
												>
													Complete
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
														Completed 🎉
													</Text>
												</View>
												<TouchableOpacity
													onPress={() =>
														handleDelete(debt.id!, debt.name)
													}
												>
													<Ionicons
														name="trash-outline"
														size={18}
														color={Colors.danger}
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

			{/* Log Payment Modal */}
			<Modal
				visible={showPaymentModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowPaymentModal(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.75)",
						justifyContent: "flex-end",
					}}
				>
					<View
						style={{
							backgroundColor: Colors.card,
							borderTopLeftRadius: 28,
							borderTopRightRadius: 28,
							padding: 24,
							gap: 16,
						}}
					>
						{/* Modal Header */}
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<View>
								<Text
									style={{
										color: Colors.text,
										fontSize: 18,
										fontFamily: Fonts.bold,
									}}
								>
									Log Payment
								</Text>
								<Text
									style={{
										color: Colors.textSecondary,
										fontSize: 13,
										fontFamily: Fonts.regular,
										marginTop: 2,
									}}
								>
									{selectedDebt?.name}
								</Text>
							</View>
							<TouchableOpacity onPress={() => setShowPaymentModal(false)}>
								<Ionicons name="close-circle" size={24} color={Colors.textLight} />
							</TouchableOpacity>
						</View>

						{/* Min / Max info row */}
						<View
							style={{
								flexDirection: "row",
								gap: 8,
							}}
						>
							<View
								style={{
									flex: 1,
									backgroundColor: Colors.card2,
									borderRadius: 12,
									padding: 12,
									alignItems: "center",
									borderWidth: 1,
									borderColor: Colors.border,
								}}
							>
								<Text
									style={{
										color: Colors.textSecondary,
										fontSize: 10,
										fontFamily: Fonts.medium,
										textTransform: "uppercase",
										letterSpacing: 0.8,
									}}
								>
									Min Payment
								</Text>
								<Text
									style={{
										color: Colors.text,
										fontSize: 14,
										fontFamily: Fonts.bold,
										marginTop: 4,
									}}
								>
									{currencySymbol}
									{selectedDebt?.min_payment.toLocaleString("en-PH", {
										minimumFractionDigits: 2,
									})}
								</Text>
							</View>
							<View
								style={{
									flex: 1,
									backgroundColor: Colors.card2,
									borderRadius: 12,
									padding: 12,
									alignItems: "center",
									borderWidth: 1,
									borderColor: Colors.border,
								}}
							>
								<Text
									style={{
										color: Colors.textSecondary,
										fontSize: 10,
										fontFamily: Fonts.medium,
										textTransform: "uppercase",
										letterSpacing: 0.8,
									}}
								>
									Max (Balance)
								</Text>
								<Text
									style={{
										color: Colors.primary,
										fontSize: 14,
										fontFamily: Fonts.bold,
										marginTop: 4,
									}}
								>
									{currencySymbol}
									{selectedDebt?.balance.toLocaleString("en-PH", {
										minimumFractionDigits: 2,
									})}
								</Text>
							</View>
						</View>

						{/* Payment Amount Input */}
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
								Payment Amount ({currencySymbol})
							</Text>
							<TextInput
								value={paymentDisplay}
								onChangeText={handleAmountChange}
								placeholder="0.00"
								placeholderTextColor={Colors.textLight}
								keyboardType="decimal-pad"
								autoFocus
								style={{
									backgroundColor: Colors.card2,
									padding: 16,
									borderRadius: 14,
									color: paymentError ? Colors.danger : Colors.text,
									borderWidth: 1.5,
									borderColor: paymentError
										? Colors.danger
										: paymentAmount && isValidAmount
											? Colors.success
											: paymentAmount
												? Colors.border
												: Colors.border,
									fontSize: 24,
									fontFamily: Fonts.bold,
									textAlign: "center",
								}}
							/>
							{/* Inline error message */}
							{paymentError ? (
								<Text
									style={{
										color: Colors.danger,
										fontSize: 12,
										fontFamily: Fonts.medium,
										marginTop: 6,
										textAlign: "center",
									}}
								>
									{paymentError}
								</Text>
							) : null}
						</View>

						{/* Quick Amount Buttons */}
						<View style={{ flexDirection: "row", gap: 8 }}>
							{[
								selectedDebt?.min_payment || 0,
								(selectedDebt?.min_payment || 0) * 1.5,
								(selectedDebt?.min_payment || 0) * 2,
							].map((amount, index) => {
								// Cap quick-select buttons at the balance
								const capped = Math.min(amount, selectedDebt?.balance || amount);
								return (
									<TouchableOpacity
										key={index}
										onPress={() => handleAmountChange(capped.toFixed(2))}
										style={{
											flex: 1,
											padding: 10,
											backgroundColor: Colors.card2,
											borderRadius: 10,
											alignItems: "center",
											borderWidth: 1,
											borderColor: Colors.border,
										}}
									>
										<Text
											style={{
												color: Colors.textSecondary,
												fontSize: 10,
												fontFamily: Fonts.medium,
												textTransform: "uppercase",
											}}
										>
											{index === 0 ? "Min" : index === 1 ? "1.5x" : "2x"}
										</Text>
										<Text
											style={{
												color: Colors.text,
												fontSize: 13,
												fontFamily: Fonts.bold,
												marginTop: 2,
											}}
										>
											{currencySymbol}
											{capped.toFixed(2)}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>

						{/* New Balance Preview */}
						{paymentAmount && !isNaN(parsedAmount) && isValidAmount && (
							<View
								style={{
									backgroundColor: Colors.success + "15",
									borderRadius: 12,
									padding: 14,
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									borderWidth: 1,
									borderColor: Colors.success + "40",
								}}
							>
								<Text
									style={{
										color: Colors.textSecondary,
										fontSize: 13,
										fontFamily: Fonts.medium,
									}}
								>
									New Balance
								</Text>
								<Text
									style={{
										color: Colors.success,
										fontSize: 18,
										fontFamily: Fonts.bold,
									}}
								>
									{currencySymbol}
									{Math.max(
										0,
										(selectedDebt?.balance || 0) - parsedAmount,
									).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
								</Text>
							</View>
						)}

						{/* Confirm Button — disabled when invalid */}
						<TouchableOpacity
							onPress={handleSavePayment}
							disabled={!isValidAmount}
							style={{
								backgroundColor: isValidAmount ? Colors.primary : Colors.border,
								padding: 18,
								borderRadius: 16,
								alignItems: "center",
								opacity: isValidAmount ? 1 : 0.5,
							}}
						>
							<Text
								style={{
									color: "white",
									fontSize: 16,
									fontFamily: Fonts.semiBold,
								}}
							>
								Confirm Payment
							</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</Modal>
		</>
	);
}
