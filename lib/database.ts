import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("payoff.db");

export interface Debt {
	id?: number;
	name: string;
	balance: number;
	interest_rate: number;
	min_payment: number;
	is_paid?: number;
	created_at?: string;
}

export function initDatabase() {
	db.execSync(`
    CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      balance REAL NOT NULL,
      interest_rate REAL NOT NULL,
      min_payment REAL NOT NULL,
      is_paid INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

	try {
		db.execSync(`ALTER TABLE debts ADD COLUMN is_paid INTEGER DEFAULT 0;`);
	} catch (e) {
		// Column already exists
	}
}

export function addDebt(debt: Debt): void {
	db.runSync(
		`INSERT INTO debts (name, balance, interest_rate, min_payment) VALUES (?, ?, ?, ?)`,
		[debt.name, debt.balance, debt.interest_rate, debt.min_payment],
	);
}

export function getAllDebts(): Debt[] {
	return db.getAllSync<Debt>(`SELECT * FROM debts WHERE is_paid = 0 ORDER BY created_at DESC`);
}

export function getPaidDebts(): Debt[] {
	return db.getAllSync<Debt>(`SELECT * FROM debts WHERE is_paid = 1 ORDER BY created_at DESC`);
}

export function markDebtAsPaid(id: number): void {
	db.runSync(`UPDATE debts SET is_paid = 1 WHERE id = ?`, [id]);
}

export function deleteDebt(id: number): void {
	db.runSync(`DELETE FROM debts WHERE id = ?`, [id]);
}

export function updateDebt(debt: Debt): void {
	db.runSync(`UPDATE debts SET name=?, balance=?, interest_rate=?, min_payment=? WHERE id=?`, [
		debt.name,
		debt.balance,
		debt.interest_rate,
		debt.min_payment,
		debt.id!,
	]);
}

export function clearAllDebts(): void {
	db.execSync(`DELETE FROM debts;`);
}
