import Colors, { Fonts } from "../../constants/colors";
import { getAllDebts } from "../../lib/database";
import { getSettings } from "../../lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { sendMessage } from "../../lib/ai";
import { useState, useRef } from "react";
import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
} from "react-native";

interface Message {
	role: "user" | "assistant";
	content: string;
}

export default function Coach() {
	const [messages, setMessages] = useState<Message[]>([
		{
			role: "assistant",
			content:
				"Hi! I'm your AI Debt Coach 💪 I can help you create a personalized payoff plan, answer questions about your debts, and keep you motivated.\n\nI work both online and offline! What would you like to know?",
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const scrollRef = useRef<ScrollView>(null);

	const handleSend = async () => {
		if (!input.trim() || loading) return;

		const userMessage = input.trim();
		setInput("");
		setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
		setLoading(true);

		try {
			const debts = getAllDebts();
			const settings = await getSettings();

			const { response, isOnline: online } = await sendMessage(
				userMessage,
				messages.map((m) => ({ role: m.role, content: m.content })),
				debts,
				settings,
			);

			setMessages((prev) => [...prev, { role: "assistant", content: response }]);
		} catch (error) {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Sorry, something went wrong. Please try again!",
				},
			]);
		} finally {
			setLoading(false);
			setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: Colors.background }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={90}
		>
			{/* Header */}
			<View
				style={{
					margin: 16,
					marginBottom: 8,
					padding: 16,
					backgroundColor: Colors.card,
					borderRadius: 16,
					borderWidth: 1,
					borderColor: Colors.border,
					flexDirection: "row",
					alignItems: "center",
					gap: 12,
				}}
			>
				<View
					style={{
						width: 44,
						height: 44,
						borderRadius: 14,
						backgroundColor: Colors.primary,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Ionicons name="chatbubble-ellipses" size={22} color="white" />
				</View>
				<View style={{ flex: 1 }}>
					<Text
						style={{
							color: Colors.text,
							fontSize: 15,
							fontFamily: Fonts.semiBold,
						}}
					>
						AI Debt Coach
					</Text>
					<Text
						style={{
							color: Colors.textSecondary,
							fontSize: 12,
							fontFamily: Fonts.regular,
							marginTop: 2,
						}}
					>
						Works online & offline
					</Text>
				</View>
			</View>

			{/* Messages */}
			<ScrollView
				ref={scrollRef}
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 8 }}
				showsVerticalScrollIndicator={false}
				onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
			>
				{messages.map((msg, index) => (
					<View
						key={index}
						style={{
							alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
							maxWidth: "82%",
						}}
					>
						<View
							style={{
								backgroundColor: msg.role === "user" ? Colors.primary : Colors.card,
								borderRadius: 18,
								borderBottomRightRadius: msg.role === "user" ? 4 : 18,
								borderBottomLeftRadius: msg.role === "assistant" ? 4 : 18,
								padding: 14,
								borderWidth: msg.role === "assistant" ? 1 : 0,
								borderColor: Colors.border,
							}}
						>
							<Text
								style={{
									color: Colors.text,
									fontSize: 15,
									fontFamily: Fonts.regular,
									lineHeight: 22,
								}}
							>
								{msg.content}
							</Text>
						</View>
					</View>
				))}

				{loading && (
					<View style={{ alignSelf: "flex-start" }}>
						<View
							style={{
								backgroundColor: Colors.card,
								borderRadius: 18,
								borderBottomLeftRadius: 4,
								padding: 14,
								borderWidth: 1,
								borderColor: Colors.border,
							}}
						>
							<Text
								style={{
									color: Colors.textSecondary,
									fontFamily: Fonts.regular,
									fontSize: 14,
								}}
							>
								Thinking...
							</Text>
						</View>
					</View>
				)}
			</ScrollView>

			{/* Input */}
			<View
				style={{
					flexDirection: "row",
					padding: 12,
					gap: 10,
					backgroundColor: Colors.card,
					borderTopWidth: 1,
					borderTopColor: Colors.border,
				}}
			>
				<TextInput
					value={input}
					onChangeText={setInput}
					placeholder="Ask your debt coach..."
					placeholderTextColor={Colors.textLight}
					style={{
						flex: 1,
						backgroundColor: Colors.background,
						borderRadius: 22,
						paddingHorizontal: 18,
						paddingVertical: 12,
						color: Colors.text,
						fontSize: 15,
						fontFamily: Fonts.regular,
						borderWidth: 1,
						borderColor: Colors.border,
					}}
					multiline
					onSubmitEditing={handleSend}
				/>
				<TouchableOpacity
					onPress={handleSend}
					disabled={loading}
					style={{
						backgroundColor: loading ? Colors.textLight : Colors.primary,
						width: 48,
						height: 48,
						borderRadius: 24,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Ionicons name="send" size={18} color="white" />
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}
