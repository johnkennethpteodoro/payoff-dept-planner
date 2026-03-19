import { Debt } from "./database";
import { AppSettings } from "./storage";

function generateOfflineResponse(message: string, debts: Debt[], settings: AppSettings): string {
	const msg = message.toLowerCase();
	const symbol = settings.currencySymbol;
	const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
	const totalMonthly = debts.reduce((sum, d) => sum + d.min_payment, 0);
	const monthsToFreedom = totalMonthly > 0 ? Math.ceil(totalDebt / totalMonthly) : 0;
	const highestInterest =
		debts.length > 0
			? debts.reduce((max, d) => (d.interest_rate > max.interest_rate ? d : max), debts[0])
			: null;
	const smallestDebt =
		debts.length > 0
			? debts.reduce((min, d) => (d.balance < min.balance ? d : min), debts[0])
			: null;

	if (debts.length === 0) {
		return `You haven't added any debts yet! Start by tapping "Add New Debt" on the dashboard. Once you add your debts, I can give you a personalized payoff plan! 💪`;
	}

	if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
		return `Hi${settings.userName ? `, ${settings.userName}` : ""}! 👋 I'm your AI Debt Coach. You currently have ${debts.length} active ${debts.length === 1 ? "debt" : "debts"} totaling ${symbol}${totalDebt.toLocaleString()}. How can I help you today?`;
	}

	if (msg.includes("total") || msg.includes("how much") || msg.includes("balance")) {
		return `Your total debt is ${symbol}${totalDebt.toLocaleString("en-PH", { minimumFractionDigits: 2 })} across ${debts.length} ${debts.length === 1 ? "debt" : "debts"}.\n\nBreakdown:\n${debts.map((d) => `• ${d.name}: ${symbol}${d.balance.toLocaleString()}`).join("\n")}\n\nYou're paying ${symbol}${totalMonthly.toLocaleString()} minimum per month. 💪`;
	}

	if (
		msg.includes("how long") ||
		msg.includes("when") ||
		msg.includes("months") ||
		msg.includes("free")
	) {
		if (monthsToFreedom > 0) {
			const years = Math.floor(monthsToFreedom / 12);
			const months = monthsToFreedom % 12;
			const timeStr =
				years > 0
					? `${years} year${years > 1 ? "s" : ""} and ${months} months`
					: `${months} months`;
			return `Based on your minimum payments, you'll be debt free in approximately ${timeStr}! 🎯\n\nTip: Paying even ${symbol}500-1,000 extra per month can cut this time significantly. Would you like to know which debt to focus on first?`;
		}
		return `Add your minimum monthly payments to each debt and I can calculate exactly when you'll be debt free! 🎯`;
	}

	if (msg.includes("snowball")) {
		if (smallestDebt) {
			return `❄️ The Snowball Method:\n\nFocus ALL extra money on your smallest debt first:\n\n🎯 Start with: ${smallestDebt.name}\n💰 Balance: ${symbol}${smallestDebt.balance.toLocaleString()}\n📅 Min payment: ${symbol}${smallestDebt.min_payment}/mo\n\nPay this off first, then roll that payment into the next debt. This builds momentum and motivation! 💪`;
		}
	}

	if (msg.includes("avalanche")) {
		if (highestInterest) {
			return `🏔️ The Avalanche Method:\n\nFocus ALL extra money on your highest interest debt first:\n\n🎯 Start with: ${highestInterest.name}\n📈 Interest rate: ${highestInterest.interest_rate}%\n💰 Balance: ${symbol}${highestInterest.balance.toLocaleString()}\n\nThis saves the most money in interest over time! 💰`;
		}
	}

	if (
		msg.includes("which") ||
		msg.includes("first") ||
		msg.includes("focus") ||
		msg.includes("start")
	) {
		if (smallestDebt && highestInterest) {
			return `Great question! You have two proven strategies:\n\n❄️ Snowball — Pay ${smallestDebt.name} first (${symbol}${smallestDebt.balance.toLocaleString()})\n→ Best for motivation & momentum\n\n🏔️ Avalanche — Pay ${highestInterest.name} first (${highestInterest.interest_rate}% interest)\n→ Best for saving money\n\nI recommend the Snowball method if you need motivation, or Avalanche if you want to minimize interest paid. Which sounds better for you?`;
		}
	}

	if (
		msg.includes("motivat") ||
		msg.includes("hard") ||
		msg.includes("difficult") ||
		msg.includes("give up") ||
		msg.includes("tired")
	) {
		return `You've got this! 💪\n\nRemember why you started — financial freedom means:\n✅ Less stress about money\n✅ More money for things you love\n✅ Security for your future\n\nYou're already ahead of most people just by tracking your debts! Every peso you pay is a step closer to freedom. Keep going! 🔥`;
	}

	if (
		msg.includes("tip") ||
		msg.includes("advice") ||
		msg.includes("help") ||
		msg.includes("suggest")
	) {
		return `Here are my top tips for your situation:\n\n1️⃣ Pay more than the minimum — even ${symbol}500 extra makes a big difference\n2️⃣ Use the Snowball method — pay ${smallestDebt?.name || "your smallest debt"} first\n3️⃣ Cut one expense — redirect it to debt payments\n4️⃣ Celebrate small wins — every paid debt matters! 🎉\n5️⃣ Stay consistent — small steps add up over time`;
	}

	if (msg.includes("interest")) {
		if (highestInterest) {
			return `Your highest interest debt is ${highestInterest.name} at ${highestInterest.interest_rate}%.\n\nFor ${highestInterest.name}, you're paying roughly ${symbol}${((highestInterest.balance * highestInterest.interest_rate) / 100 / 12).toFixed(0)} in interest per month!\n\nPaying this off first (Avalanche method) will save you the most money. 💰`;
		}
	}

	if (msg.includes("plan") || msg.includes("strategy") || msg.includes("roadmap")) {
		const sortedByBalance = [...debts].sort((a, b) => a.balance - b.balance);
		return `Here's your personalized payoff plan:\n\n${sortedByBalance.map((d, i) => `${i + 1}. ${d.name} — ${symbol}${d.balance.toLocaleString()} (${d.interest_rate}%)`).join("\n")}\n\nTotal: ${symbol}${totalDebt.toLocaleString()}\nMonthly minimum: ${symbol}${totalMonthly.toLocaleString()}\nEstimated time: ${monthsToFreedom} months\n\nFocus on one debt at a time! 🎯`;
	}

	return `I'm here to help you become debt free! Here's what I can help with:\n\n• 📊 Your debt overview\n• 🎯 Which debt to pay first\n• ⏱️ How long until you're debt free\n• 💡 Tips to pay off faster\n• 💪 Motivation when you need it\n\nWhat would you like to know?`;
}

export async function sendMessage(
	message: string,
	conversationHistory: { role: string; content: string }[],
	debts: Debt[],
	settings: AppSettings,
): Promise<{ response: string; isOnline: boolean }> {
	const response = generateOfflineResponse(message, debts, settings);
	return { response, isOnline: false };
}
