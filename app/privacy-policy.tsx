import { View, Text, ScrollView } from "react-native";
import Colors, { Fonts } from "../constants/colors";

export default function PrivacyPolicy() {
	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: Colors.background }}
			contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
		>
			<Text
				style={{
					color: Colors.text,
					fontSize: 22,
					fontFamily: Fonts.bold,
					marginBottom: 8,
				}}
			>
				Privacy Policy
			</Text>

			<Text
				style={{
					color: Colors.textSecondary,
					fontSize: 12,
					fontFamily: Fonts.regular,
					marginBottom: 24,
				}}
			>
				Last updated: March 2026
			</Text>

			{[
				{
					title: "Overview",
					body: "Payoff — Debt Planner is committed to protecting your privacy. This Privacy Policy explains how we handle your information.",
				},
				{
					title: "Data Collection",
					body: "We do NOT collect any personal data. The App operates completely offline. All data you enter (debt names, balances, interest rates, payments) is stored locally on your device only.",
				},
				{
					title: "Data Storage",
					body: "All data is stored locally on your device using SQLite database. No data is transmitted to any server. No account or registration is required. No internet connection is required to use the App.",
				},
				{
					title: "Third Party Services",
					body: "The App does not use any third-party analytics, advertising, or tracking services.",
				},
				{
					title: "Data Security",
					body: "Your financial data never leaves your device. We have no access to your data whatsoever.",
				},
				{
					title: "Children's Privacy",
					body: "The App does not knowingly collect information from children under 13.",
				},
				{
					title: "Contact",
					body: "If you have questions about this Privacy Policy, contact us at:\njohnkennethpteodoro@gmail.com",
				},
			].map((section, index) => (
				<View key={index} style={{ marginBottom: 24 }}>
					<Text
						style={{
							color: Colors.text,
							fontSize: 16,
							fontFamily: Fonts.semiBold,
							marginBottom: 8,
						}}
					>
						{section.title}
					</Text>
					<Text
						style={{
							color: Colors.textSecondary,
							fontSize: 14,
							fontFamily: Fonts.regular,
							lineHeight: 22,
						}}
					>
						{section.body}
					</Text>
				</View>
			))}
		</ScrollView>
	);
}
