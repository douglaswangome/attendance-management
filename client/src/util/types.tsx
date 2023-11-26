// Props
export interface CustomLinkProps {
	to: string;
	text: string;
	role?: "admin" | "student" | "";
}

// Pages
export interface Credentials {
	username: string;
	role?: string;
	email: string;
	password: string;
}

export interface RegisterCredentialsErrors {
	errors: boolean;
	focus: boolean;
	match: boolean;
}

export interface Timetable {
	code: string;
	lecturerID: string;
	room: string;
	date: { start: string; end: string };
	semester: { year: string; period: string };
}

export interface ClassDetails {
	lecturer: string;
	room: string | "online";
	code: string;
	date: { start: string; end: string };
}

export interface Point {
	latitude: number;
	longitude: number;
}

export interface Poly {
	doneRight: boolean;
	doneLeft: boolean;
}

export interface Polygon {
	farRight: Point;
	farLeft: Point;
	nearRight: Point;
	nearLeft: Point;
}

export interface StudentModal {
	modal: { show: boolean; message: string };
}

export interface Unit {
	code: string;
	title: string;
	lecturer: string;
	semester: { year: string; period: string };
	school: string;
	department: string;
}

export interface User {
	_id: string;
	username: string;
	email: { address: string; verified: boolean };
	role: "student" | "admin";
	student?: { year: string; period: string };
	school: string;
	department: string;
}

export interface InitialState {
	// User Related
	// // Class Related
	classDetails: ClassDetails;
	// // Location Related
	location: Point;
	// // Polygon Related
	poly: Poly;
	polygon: Polygon;
	// // Student Related
	studentModal?: StudentModal;
	// // User Related
	user: User;
	// Unit Related
	units: Unit[];

	// System Related
	timetable: Timetable[];
}
