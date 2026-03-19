import { getAllDebts, getPaidDebts, Debt } from "../../lib/database";
import Colors, { Fonts } from "../../constants/colors";
import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export default function Progress() {
	const [debts, setDebts] = useState<Debt[]>([]);
	const [paidDebts, setPaidDebts] = useState<Debt[]>([]);

	useFocusEffect(
		useCallback(() => {
			setDebts(getAllDebts());
			setPaidDebts(getPaidDebts());
		}, []),
	);

	const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
	const totalMinPayment = debts.reduce((sum, d) => sum + d.min_payment, 0);
	const monthsToFreedom = totalMinPayment > 0 ? Math.ceil(totalDebt / totalMinPayment) : 0;

	const milestones = [
		{
			label: "Added first debt",
			icon: "flag-outline",
			done: debts.length > 0 || paidDebts.length > 0,
		},
		{
			label: "Created payoff plan",
			icon: "analytics-outline",
			done: debts.length > 0 || paidDebts.length > 0,
		},
		{
			label: "First debt completed",
			icon: "checkmark-circle-outline",
			done: paidDebts.length >= 1,
		},
		{
			label: "Halfway there!",
			icon: "trending-up-outline",
			done:
				paidDebts.length > 0 &&
				paidDebts.length >= Math.ceil((debts.length + paidDebts.length) / 2),
		},
		{
			label: "Debt free!",
			icon: "trophy-outline",
			done: debts.length === 0 && paidDebts.length > 0,
		},
	];

	const completedMilestones = milestones.filter((m) => m.done).length;
	const progressPercent = (completedMilestones / milestones.length) * 100;

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: Colors.background }}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 60 }}
		>
			{/* Hero Card */}
			<LinearGradient
				colors={["#E53935", "#8B0000"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={{ borderRadius: 24, padding: 24 }}
			>
				{/* Top Row */}
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
								color: "rgba(255,255,255,0.65)",
								fontSize: 12,
								fontFamily: Fonts.medium,
								letterSpacing: 1.2,
								textTransform: "uppercase",
							}}
						>
							Your Journey
						</Text>
						<Text
							style={{
								color: "white",
								fontSize: 26,
								fontFamily: Fonts.bold,
								marginTop: 4,
							}}
						>
							{debts.length > 0
								? `${monthsToFreedom} months`
								: debts.length === 0 && paidDebts.length > 0
									? "🎉 Done!"
									: "--"}
						</Text>
						<Text
							style={{
								color: "rgba(255,255,255,0.65)",
								fontSize: 13,
								fontFamily: Fonts.regular,
								marginTop: 2,
							}}
						>
							{debts.length === 0 && paidDebts.length > 0
								? "All debts completed!"
								: "to debt freedom"}
						</Text>
					</View>

					<View
						style={{
							width: 64,
							height: 64,
							borderRadius: 20,
							backgroundColor: "rgba(255,255,255,0.2)",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Ionicons name="trophy" size={32} color="white" />
					</View>
				</View>

				{/* Progress Bar */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginBottom: 8,
					}}
				>
					<Text
						style={{
							color: "rgba(255,255,255,0.65)",
							fontSize: 12,
							fontFamily: Fonts.medium,
						}}
					>
						Milestone progress
					</Text>
					<Text
						style={{
							color: "white",
							fontSize: 12,
							fontFamily: Fonts.bold,
						}}
					>
						{completedMilestones}/{milestones.length}
					</Text>
				</View>
				<View
					style={{
						height: 6,
						backgroundColor: "rgba(255,255,255,0.25)",
						borderRadius: 3,
					}}
				>
					<View
						style={{
							height: 6,
							backgroundColor: "white",
							borderRadius: 3,
							width: `${progressPercent}%`,
						}}
					/>
				</View>
			</LinearGradient>

			{/* Stats Row */}
			<View style={{ flexDirection: "row", gap: 10 }}>
				<View
					style={{
						flex: 1,
						backgroundColor: Colors.card,
						borderRadius: 16,
						padding: 18,
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
						Active
					</Text>
					<Text
						style={{
							color: Colors.primary,
							fontSize: 36,
							fontFamily: Fonts.bold,
							marginTop: 6,
						}}
					>
						{debts.length}
					</Text>
					{debts.length > 0 && (
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 11,
								fontFamily: Fonts.regular,
								marginTop: 2,
							}}
						>
							debts remaining
						</Text>
					)}
				</View>

				<View
					style={{
						flex: 1,
						backgroundColor: Colors.card,
						borderRadius: 16,
						padding: 18,
						borderWidth: 1,
						borderColor: paidDebts.length > 0 ? Colors.success + "40" : Colors.border,
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
						Completed
					</Text>
					<Text
						style={{
							color: Colors.success,
							fontSize: 36,
							fontFamily: Fonts.bold,
							marginTop: 6,
						}}
					>
						{paidDebts.length}
					</Text>
					{paidDebts.length > 0 && (
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 11,
								fontFamily: Fonts.regular,
								marginTop: 2,
							}}
						>
							debts done 🎉
						</Text>
					)}
				</View>
			</View>

			{/* Milestones */}
			<View
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
						letterSpacing: 0.8,
						textTransform: "uppercase",
					}}
				>
					Milestones
				</Text>
				<Text
					style={{
						color: Colors.textSecondary,
						fontSize: 12,
						fontFamily: Fonts.regular,
					}}
				>
					{Math.round(progressPercent)}% complete
				</Text>
			</View>

			{milestones.map((milestone, index) => (
				<View
					key={index}
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 14,
						backgroundColor: Colors.card,
						borderRadius: 16,
						padding: 16,
						borderWidth: 1,
						borderColor: milestone.done ? Colors.primary : Colors.border,
					}}
				>
					<View
						style={{
							width: 42,
							height: 42,
							borderRadius: 13,
							backgroundColor: milestone.done ? Colors.primary : Colors.card2,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{milestone.done ? (
							<Ionicons name="checkmark" size={20} color="white" />
						) : (
							<Text
								style={{
									color: Colors.textLight,
									fontSize: 15,
									fontFamily: Fonts.bold,
								}}
							>
								{index + 1}
							</Text>
						)}
					</View>

					<View style={{ flex: 1 }}>
						<Text
							style={{
								color: milestone.done ? Colors.text : Colors.textSecondary,
								fontSize: 15,
								fontFamily: milestone.done ? Fonts.semiBold : Fonts.regular,
							}}
						>
							{milestone.label}
						</Text>
					</View>

					<Ionicons
						name={milestone.icon as any}
						size={20}
						color={milestone.done ? Colors.primary : Colors.textLight}
					/>
				</View>
			))}
		</ScrollView>
	);
}
