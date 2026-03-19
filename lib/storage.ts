import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppSettings {
	userName: string;
	currency: string;
	currencySymbol: string;
	strategy: "snowball" | "avalanche";
	darkMode: boolean;
	notifications: boolean;
}

export const defaultSettings: AppSettings = {
	userName: "",
	currency: "PHP",
	currencySymbol: "₱",
	strategy: "snowball",
	darkMode: true,
	notifications: false,
};

export async function getSettings(): Promise<AppSettings> {
	try {
		const data = await AsyncStorage.getItem("settings");
		if (data) return { ...defaultSettings, ...JSON.parse(data) };
		return defaultSettings;
	} catch {
		return defaultSettings;
	}
}

export async function saveSettings(settings: AppSettings): Promise<void> {
	await AsyncStorage.setItem("settings", JSON.stringify(settings));
}

export const currencies = [
	{ label: "Philippine Peso", value: "PHP", symbol: "₱" },
	{ label: "US Dollar", value: "USD", symbol: "$" },
	{ label: "Euro", value: "EUR", symbol: "€" },
	{ label: "British Pound", value: "GBP", symbol: "£" },
	{ label: "Japanese Yen", value: "JPY", symbol: "¥" },
	{ label: "Australian Dollar", value: "AUD", symbol: "A$" },
	{ label: "Canadian Dollar", value: "CAD", symbol: "C$" },
	{ label: "Singapore Dollar", value: "SGD", symbol: "S$" },
];
