import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";
import { useState } from "react";

const slides = [
	{
		icon: "wallet-outline",
		title: "Track Your Debts",
		subtitle: "Add all your debts in one place. Credit cards, loans, anything.",
	},
	{
		icon: "analytics-outline",
		title: "Get a Payoff Plan",
		subtitle: "We calculate the fastest way to become debt free using proven strategies.",
	},
	{
		icon: "chatbubble-outline",
		title: "AI Debt Coach",
		subtitle: "Get personalized advice and stay motivated on your journey to debt freedom.",
	},
	{
		icon: "trophy-outline",
		title: "Become Debt Free",
		subtitle: "Track your progress and celebrate every milestone along the way!",
	},
];

export default function Onboarding() {
	const [currentSlide, setCurrentSlide] = useState(0);

	const handleNext = () => {
		if (currentSlide < slides.length - 1) {
			setCurrentSlide(currentSlide + 1);
		} else {
			router.replace("/(tabs)");
		}
	};

	const handleSkip = () => {
		router.replace("/(tabs)");
	};

	const slide = slides[currentSlide];

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
			<View style={{ flex: 1, padding: 24 }}>
				{/* Skip Button */}
				<TouchableOpacity
					onPress={handleSkip}
					style={{ alignSelf: "flex-end", padding: 8 }}
				>
					<Text style={{ color: Colors.textSecondary, fontSize: 15 }}>Skip</Text>
				</TouchableOpacity>

				{/* Icon */}
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 32 }}>
					<View
						style={{
							width: 140,
							height: 140,
							borderRadius: 70,
							backgroundColor: Colors.primary,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Ionicons name={slide.icon as any} size={70} color="white" />
					</View>

					{/* Text */}
					<View style={{ alignItems: "center", gap: 12 }}>
						<Text
							style={{
								color: Colors.text,
								fontSize: 28,
								fontWeight: "bold",
								textAlign: "center",
							}}
						>
							{slide.title}
						</Text>
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 16,
								textAlign: "center",
								lineHeight: 24,
								paddingHorizontal: 16,
							}}
						>
							{slide.subtitle}
						</Text>
					</View>

					{/* Dots */}
					<View style={{ flexDirection: "row", gap: 8 }}>
						{slides.map((_, index) => (
							<View
								key={index}
								style={{
									width: index === currentSlide ? 24 : 8,
									height: 8,
									borderRadius: 4,
									backgroundColor:
										index === currentSlide ? Colors.primary : Colors.border,
								}}
							/>
						))}
					</View>
				</View>

				{/* Next Button */}
				<TouchableOpacity
					onPress={handleNext}
					style={{
						backgroundColor: Colors.primary,
						padding: 18,
						borderRadius: 14,
						alignItems: "center",
					}}
				>
					<Text style={{ color: "white", fontSize: 17, fontWeight: "700" }}>
						{currentSlide === slides.length - 1 ? "Let's Get Started!" : "Next"}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
