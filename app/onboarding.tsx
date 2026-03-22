import {
	View,
	Text,
	TouchableOpacity,
	SafeAreaView,
	TextInput,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors, { Fonts } from "../constants/colors";
import { useState } from "react";
import { saveSettings, defaultSettings } from "../lib/storage";

const slides = [
	{
		icon: "wallet-outline",
		title: "Track Your Debts",
		subtitle: "Add all your debts in one place. Credit cards, loans, anything.",
	},
	{
		icon: "analytics-outline",
		title: "Get a Climb Plan",
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
	const [name, setName] = useState("");
	const [showNameScreen, setShowNameScreen] = useState(false);

	const handleNext = () => {
		if (currentSlide < slides.length - 1) {
			setCurrentSlide(currentSlide + 1);
		} else {
			setShowNameScreen(true);
		}
	};

	const handleSkip = () => {
		setShowNameScreen(true);
	};

	const handleGetStarted = async () => {
		await saveSettings({
			...defaultSettings,
			userName: name.trim(),
		});
		router.replace("/(tabs)");
	};

	const slide = slides[currentSlide];

	if (showNameScreen) {
		return (
			<KeyboardAvoidingView
				style={{ flex: 1, backgroundColor: Colors.background }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<SafeAreaView style={{ flex: 1 }}>
					<View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
						{/* Icon */}
						<View
							style={{
								width: 100,
								height: 100,
								borderRadius: 28,
								backgroundColor: Colors.primary,
								alignItems: "center",
								justifyContent: "center",
								marginBottom: 32,
								alignSelf: "center",
							}}
						>
							<Ionicons name="person-outline" size={48} color="white" />
						</View>

						{/* Text */}
						<Text
							style={{
								color: Colors.text,
								fontSize: 28,
								fontFamily: Fonts.bold,
								textAlign: "center",
							}}
						>
							What's your name?
						</Text>
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 15,
								fontFamily: Fonts.regular,
								textAlign: "center",
								marginTop: 10,
								lineHeight: 24,
							}}
						>
							We'll use it to personalize{"\n"}your experience
						</Text>

						{/* Input */}
						<TextInput
							value={name}
							onChangeText={setName}
							placeholder="Enter your name"
							placeholderTextColor={Colors.textLight}
							autoFocus
							style={{
								backgroundColor: Colors.card,
								padding: 18,
								borderRadius: 16,
								color: Colors.text,
								borderWidth: 1,
								borderColor: name ? Colors.primary : Colors.border,
								fontSize: 18,
								fontFamily: Fonts.medium,
								textAlign: "center",
								marginTop: 32,
							}}
						/>

						{/* Get Started Button */}
						<TouchableOpacity
							style={{
								backgroundColor: Colors.primary,
								padding: 18,
								borderRadius: 16,
								alignItems: "center",
								marginTop: 16,
								opacity: 1,
							}}
							onPress={handleGetStarted}
						>
							<Text
								style={{
									color: "white",
									fontSize: 17,
									fontFamily: Fonts.bold,
								}}
							>
								{name.trim()
									? `Let's Go, ${name.trim()}! 🚀`
									: "Let's Get Started! 🚀"}
							</Text>
						</TouchableOpacity>

						{/* Skip */}
						<TouchableOpacity
							style={{ alignItems: "center", padding: 16, marginTop: 4 }}
							onPress={handleGetStarted}
						>
							<Text
								style={{
									color: Colors.textSecondary,
									fontSize: 14,
									fontFamily: Fonts.regular,
								}}
							>
								Skip for now
							</Text>
						</TouchableOpacity>
					</View>
				</SafeAreaView>
			</KeyboardAvoidingView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
			<View style={{ flex: 1, padding: 24 }}>
				{/* Skip Button */}
				<TouchableOpacity
					onPress={handleSkip}
					style={{ alignSelf: "flex-end", padding: 8 }}
				>
					<Text
						style={{
							color: Colors.textSecondary,
							fontSize: 15,
							fontFamily: Fonts.medium,
						}}
					>
						Skip
					</Text>
				</TouchableOpacity>

				{/* Icon */}
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 32 }}>
					<View
						style={{
							width: 140,
							height: 140,
							borderRadius: 40,
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
								fontFamily: Fonts.bold,
								textAlign: "center",
							}}
						>
							{slide.title}
						</Text>
						<Text
							style={{
								color: Colors.textSecondary,
								fontSize: 16,
								fontFamily: Fonts.regular,
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
						borderRadius: 16,
						alignItems: "center",
					}}
				>
					<Text
						style={{
							color: "white",
							fontSize: 17,
							fontFamily: Fonts.bold,
						}}
					>
						{currentSlide === slides.length - 1 ? "Continue" : "Next"}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
