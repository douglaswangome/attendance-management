interface Point {
	latitude: number;
	longitude: number;
}

export interface Semester {
	year: string;
	period: string;
}

export interface Attendance {
	username: string;
	present: boolean;
	location: Point;
}
export interface Timetable {
	code: string;
	lecturer: string;
	room: string;
	date: string;
	semester: string;
}
