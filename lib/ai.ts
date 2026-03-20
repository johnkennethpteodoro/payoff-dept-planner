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
	const largestDebt =
		debts.length > 0
			? debts.reduce((max, d) => (d.balance > max.balance ? d : max), debts[0])
			: null;

	// ── Who developed this app ──────────────────────
	if (
		msg.includes("who made") ||
		msg.includes("who created") ||
		msg.includes("who built") ||
		msg.includes("who developed") ||
		msg.includes("who is the developer") ||
		msg.includes("developer") ||
		msg.includes("creator") ||
		msg.includes("john") ||
		msg.includes("kenneth")
	) {
		return `Payoff was developed by **John Kenneth Teodoro** 👨‍💻\n\nHe built this app to help Filipinos take control of their debt and achieve financial freedom. If you have feedback or suggestions, feel free to reach out!\n\nNow, how can I help you with your debt journey? 💪`;
	}

	// ── What is this app ────────────────────────────
	if (
		msg.includes("what is this app") ||
		msg.includes("what does this app") ||
		msg.includes("what is payoff") ||
		msg.includes("about this app") ||
		msg.includes("how does this work") ||
		msg.includes("what can you do") ||
		msg.includes("what can this app")
	) {
		return `Payoff is a personal debt planner app that helps you:\n\n📊 Track all your debts in one place\n📅 Create a personalized payoff plan\n💡 Choose between Snowball & Avalanche strategies\n🤖 Get AI coaching (that's me!)\n🏆 Track your progress & milestones\n\nEverything works 100% offline — your data never leaves your device! 🔒`;
	}

	// ── No debts yet ────────────────────────────────
	if (debts.length === 0) {
		return `You haven't added any debts yet! 📝\n\nHere's how to get started:\n1️⃣ Tap the "My Debts" tab\n2️⃣ Tap "Add New Debt"\n3️⃣ Choose your debt type\n4️⃣ Enter your balance, interest rate and minimum payment\n\nOnce you add your debts, I can give you a personalized payoff plan! 💪`;
	}

	// ── Greetings ────────────────────────────────────
	if (
		msg.includes("hi") ||
		msg.includes("hello") ||
		msg.includes("hey") ||
		msg.includes("good morning") ||
		msg.includes("good afternoon") ||
		msg.includes("good evening") ||
		msg.includes("kumusta") ||
		msg.includes("kamusta") ||
		msg.includes("musta") ||
		msg.match(/^(hi|hey|hello|yo|sup)[\s!?.]*$/)
	) {
		const greeting = msg.includes("good morning")
			? "Good morning"
			: msg.includes("good afternoon")
				? "Good afternoon"
				: msg.includes("good evening")
					? "Good evening"
					: "Hi";
		return `${greeting}${settings.userName ? `, ${settings.userName}` : ""}! 👋 I'm your AI Debt Coach.\n\nYou currently have ${debts.length} active ${debts.length === 1 ? "debt" : "debts"} totaling ${symbol}${totalDebt.toLocaleString()}.\n\nHow can I help you today?`;
	}

	// ── Thank you ───────────────────────────────────
	if (
		msg.includes("thank") ||
		msg.includes("thanks") ||
		msg.includes("salamat") ||
		msg.includes("ty")
	) {
		return `You're welcome${settings.userName ? `, ${settings.userName}` : ""}! 😊\n\nRemember, every step counts on your journey to debt freedom. Keep going — you've got this! 💪\n\nAnything else I can help you with?`;
	}

	// ── Total debt ──────────────────────────────────
	if (
		msg.includes("total") ||
		msg.includes("how much") ||
		msg.includes("balance") ||
		msg.includes("overview")
	) {
		return `Your total debt is ${symbol}${totalDebt.toLocaleString("en-PH", { minimumFractionDigits: 2 })} across ${debts.length} ${debts.length === 1 ? "debt" : "debts"}.\n\nBreakdown:\n${debts.map((d) => `• ${d.name}: ${symbol}${d.balance.toLocaleString()}`).join("\n")}\n\nYou're paying ${symbol}${totalMonthly.toLocaleString()} minimum per month. 💪`;
	}

	// ── How long / time ─────────────────────────────
	if (
		msg.includes("how long") ||
		msg.includes("when") ||
		msg.includes("months") ||
		msg.includes("free") ||
		msg.includes("kailan") ||
		msg.includes("debt free date")
	) {
		if (monthsToFreedom > 0) {
			const years = Math.floor(monthsToFreedom / 12);
			const months = monthsToFreedom % 12;
			const timeStr =
				years > 0
					? `${years} year${years > 1 ? "s" : ""} and ${months} months`
					: `${months} months`;
			return `Based on your minimum payments, you'll be debt free in approximately **${timeStr}**! 🎯\n\nTip: Paying even ${symbol}500-1,000 extra per month can cut this time significantly!\n\nWould you like to know which debt to focus on first?`;
		}
		return `Add your minimum monthly payments to each debt and I can calculate exactly when you'll be debt free! 🎯`;
	}

	// ── Snowball ────────────────────────────────────
	if (msg.includes("snowball")) {
		if (smallestDebt) {
			return `❄️ The Snowball Method:\n\nFocus ALL extra money on your smallest debt first:\n\n🎯 Start with: ${smallestDebt.name}\n💰 Balance: ${symbol}${smallestDebt.balance.toLocaleString()}\n📅 Min payment: ${symbol}${smallestDebt.min_payment}/mo\n\nPay this off first, then roll that payment into the next debt. This builds momentum and motivation! 💪`;
		}
	}

	// ── Avalanche ───────────────────────────────────
	if (msg.includes("avalanche")) {
		if (highestInterest) {
			return `🏔️ The Avalanche Method:\n\nFocus ALL extra money on your highest interest debt first:\n\n🎯 Start with: ${highestInterest.name}\n📈 Interest rate: ${highestInterest.interest_rate}%\n💰 Balance: ${symbol}${highestInterest.balance.toLocaleString()}\n\nThis saves the most money in interest over time! 💰`;
		}
	}

	// ── Which debt first ────────────────────────────
	if (
		msg.includes("which") ||
		msg.includes("first") ||
		msg.includes("focus") ||
		msg.includes("priority") ||
		msg.includes("start") ||
		msg.includes("alin")
	) {
		if (smallestDebt && highestInterest) {
			return `Great question! You have two proven strategies:\n\n❄️ Snowball — Pay ${smallestDebt.name} first\n(${symbol}${smallestDebt.balance.toLocaleString()} balance)\n→ Best for motivation & momentum\n\n🏔️ Avalanche — Pay ${highestInterest.name} first\n(${highestInterest.interest_rate}% interest)\n→ Best for saving money\n\nMy recommendation: If you need motivation → Snowball. If you want to save more money → Avalanche. Which sounds better for you?`;
		}
	}

	// ── Minimum payment ─────────────────────────────
	if (
		msg.includes("minimum") ||
		msg.includes("min payment") ||
		msg.includes("monthly payment") ||
		msg.includes("how much to pay")
	) {
		return `Your current minimum monthly payments:\n\n${debts.map((d) => `• ${d.name}: ${symbol}${d.min_payment.toLocaleString()}/mo`).join("\n")}\n\nTotal minimum: ${symbol}${totalMonthly.toLocaleString()}/mo\n\n💡 Tip: Always pay at least the minimum to avoid penalties. Pay more whenever possible to get debt free faster!`;
	}

	// ── Extra payment ───────────────────────────────
	if (
		msg.includes("extra") ||
		msg.includes("additional") ||
		msg.includes("more payment") ||
		msg.includes("pay more") ||
		msg.includes("dagdag")
	) {
		const extraAmount = 500;
		const newMonths =
			totalMonthly + extraAmount > 0
				? Math.ceil(totalDebt / (totalMonthly + extraAmount))
				: 0;
		const savedMonths = monthsToFreedom - newMonths;
		return `Great mindset! 💪 Here's what extra payments do:\n\nIf you pay ${symbol}500 extra/month:\n→ You'd be debt free ${savedMonths} months sooner!\n\nIf you pay ${symbol}1,000 extra/month:\n→ Even faster progress!\n\nEven small extra payments make a HUGE difference over time. Which debt should you put the extra payment on? I recommend your ${smallestDebt?.name || "smallest debt"} first! ❄️`;
	}

	// ── Interest questions ──────────────────────────
	if (msg.includes("interest")) {
		if (highestInterest) {
			return `Your highest interest debt is **${highestInterest.name}** at ${highestInterest.interest_rate}%.\n\nYou're paying roughly ${symbol}${((highestInterest.balance * highestInterest.interest_rate) / 100 / 12).toFixed(0)} in interest every month on this debt alone!\n\n💡 The Avalanche method tackles this first to save you the most money overall. 💰`;
		}
	}

	// ── Motivation ──────────────────────────────────
	if (
		msg.includes("motivat") ||
		msg.includes("hard") ||
		msg.includes("difficult") ||
		msg.includes("give up") ||
		msg.includes("tired") ||
		msg.includes("stressed") ||
		msg.includes("anxiety") ||
		msg.includes("worry") ||
		msg.includes("mahirap") ||
		msg.includes("pagod")
	) {
		return `You've got this${settings.userName ? `, ${settings.userName}` : ""}! 💪\n\nDebt freedom is hard but 100% worth it. Remember:\n\n✅ Less stress about money\n✅ More money for things you love\n✅ Security for your future\n✅ Freedom to make better choices\n\nYou're already ahead of most people just by tracking your debts! Every peso you pay brings you closer to freedom.\n\nKeep going — your future self will thank you! 🔥`;
	}

	// ── Celebrate / progress ────────────────────────
	if (
		msg.includes("progress") ||
		msg.includes("doing good") ||
		msg.includes("congrat") ||
		msg.includes("paid") ||
		msg.includes("completed") ||
		msg.includes("finished")
	) {
		return `Amazing progress${settings.userName ? `, ${settings.userName}` : ""}! 🎉\n\nEvery debt you pay off is a huge win. You're building financial freedom one payment at a time!\n\n${debts.length > 0 ? `You still have ${debts.length} debt${debts.length > 1 ? "s" : ""} to go — keep the momentum going! 💪` : `You're on your way to total debt freedom! Keep it up! 🏆`}`;
	}

	// ── Tips ────────────────────────────────────────
	if (
		msg.includes("tip") ||
		msg.includes("advice") ||
		msg.includes("suggest") ||
		msg.includes("recommend") ||
		msg.includes("payo") ||
		msg.includes("trick")
	) {
		return `Here are my top tips for your situation:\n\n1️⃣ Always pay more than the minimum\n2️⃣ Focus on one debt at a time\n3️⃣ Cut one unnecessary expense this month\n4️⃣ Use windfalls (bonus, 13th month) for debt payments\n5️⃣ Avoid taking new debt while paying off old ones\n6️⃣ Celebrate every paid debt — you earned it! 🎉\n7️⃣ Track your progress weekly to stay motivated\n\nYou're already doing step 1 by using this app! 💪`;
	}

	// ── Plan/strategy ───────────────────────────────
	if (
		msg.includes("plan") ||
		msg.includes("strategy") ||
		msg.includes("roadmap") ||
		msg.includes("schedule")
	) {
		const sortedByBalance = [...debts].sort((a, b) => a.balance - b.balance);
		return `Here's your personalized Snowball payoff plan:\n\n${sortedByBalance.map((d, i) => `${i + 1}. ${d.name}\n   ${symbol}${d.balance.toLocaleString()} at ${d.interest_rate}%\n   Min: ${symbol}${d.min_payment}/mo`).join("\n\n")}\n\nTotal: ${symbol}${totalDebt.toLocaleString()}\nMonthly minimum: ${symbol}${totalMonthly.toLocaleString()}\nEstimated time: ${monthsToFreedom} months\n\nFocus on one debt at a time! 🎯`;
	}

	// ── Specific debt questions ─────────────────────
	if (debts.some((d) => msg.includes(d.name.toLowerCase()))) {
		const mentionedDebt = debts.find((d) => msg.includes(d.name.toLowerCase()));
		if (mentionedDebt) {
			const monthlyInterest = (
				(mentionedDebt.balance * mentionedDebt.interest_rate) /
				100 /
				12
			).toFixed(0);
			const monthsLeft =
				mentionedDebt.min_payment > 0
					? Math.ceil(mentionedDebt.balance / mentionedDebt.min_payment)
					: 0;
			return `Here's the details for **${mentionedDebt.name}**:\n\n💰 Balance: ${symbol}${mentionedDebt.balance.toLocaleString()}\n📈 Interest: ${mentionedDebt.interest_rate}%\n📅 Min payment: ${symbol}${mentionedDebt.min_payment}/mo\n💸 Monthly interest cost: ~${symbol}${monthlyInterest}\n⏱️ Months to pay off: ~${monthsLeft} months\n\nWant tips on paying this off faster? 🎯`;
		}
	}

	// ── App features ────────────────────────────────
	if (
		msg.includes("feature") ||
		msg.includes("how to use") ||
		msg.includes("paano") ||
		msg.includes("tutorial")
	) {
		return `Here's how to use Payoff:\n\n📊 **Dashboard** — See your total debt overview\n💳 **My Debts** — Add, manage & log payments\n📈 **Plan** — See your personalized payoff order\n🤖 **AI Coach** — That's me! Ask anything\n🏆 **Progress** — Track milestones\n⚙️ **Settings** — Change name, currency & more\n\nWhat would you like to know more about?`;
	}

	// ── Tagalog support ─────────────────────────────
	if (
		msg.includes("utang") ||
		msg.includes("bayad") ||
		msg.includes("pera") ||
		msg.includes("libre") ||
		msg.includes("libre na") ||
		msg.includes("tulungan")
	) {
		return `Nandito ako para tulungan ka maging debt free! 💪\n\nMayroon kang ${debts.length} utang na kabuuang ${symbol}${totalDebt.toLocaleString()}.\n\nMga pwede kong tulungan:\n• 📊 Magkano ang total utang mo\n• 🎯 Aling utang ang unahin\n• ⏱️ Kailan ka magiging debt free\n• 💡 Tips para mas mabilis mabayaran\n\nAno ang gusto mong malaman?`;
	}

	// ── Default ─────────────────────────────────────
	return `I'm here to help you become debt free! 💪\n\nHere's what I can help with:\n\n• 📊 Your debt overview & breakdown\n• 🎯 Which debt to pay first\n• ⏱️ How long until you're debt free\n• 💡 Snowball & Avalanche strategies\n• 💰 Minimum & extra payment advice\n• 💪 Motivation when you need it\n• 📈 Tips to pay off faster\n\nWhat would you like to know?`;
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
