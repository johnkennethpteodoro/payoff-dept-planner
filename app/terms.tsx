import { View, Text, ScrollView } from "react-native";
import Colors, { Fonts } from "../constants/colors";

export default function Terms() {
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
				Terms of Use
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
					title: "Acceptance",
					body: "By downloading and using Climb — Debt Planner, you agree to these Terms of Use.",
				},
				{
					title: "Description",
					body: "Climb is a personal debt tracking and planning app designed to help users manage and pay off their debts.",
				},
				{
					title: "Disclaimer",
					body: "The App provides general financial planning tools only. Calculations are estimates based on user-provided data. The App is NOT a substitute for professional financial advice. We are not responsible for financial decisions made based on App calculations.",
				},
				{
					title: "User Data",
					body: "All data entered is stored locally on your device. You are responsible for maintaining accurate debt information. Deleting the App will permanently delete all your data.",
				},
				{
					title: "Limitations",
					body: 'The App is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of the App.',
				},
				{
					title: "Intellectual Property",
					body: "The App and its original content are the property of Kenneth Teodoro. All rights reserved.",
				},
				{
					title: "Governing Law",
					body: "These terms are governed by the laws of the Republic of the Philippines.",
				},
				{
					title: "Contact",
					body: "johnkennethpteodoro@gmail.com",
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
