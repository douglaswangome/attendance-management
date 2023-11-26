import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "../util/types";

export const initialState: InitialState = {
	user: {
		_id: "",
		username: "",
		email: { address: "", verified: false },
		role: "student",
		student: { year: "", period: "" }, // exclusive to students
		school: "",
		department: "",
	},
	units: [],
	location: { latitude: 0, longitude: 0 },
	polygon: {
		farRight: { latitude: 0, longitude: 0 },
		farLeft: { latitude: 0, longitude: 0 },
		nearRight: { latitude: 0, longitude: 0 },
		nearLeft: { latitude: 0, longitude: 0 },
	},
	poly: {
		doneRight: false,
		doneLeft: false,
	},
	classDetails: {
		lecturer: "",
		room: "",
		code: "",
		date: { start: "", end: "" },
		semester: { year: "", period: "" },
	},
	studentModal: {
		modal: { show: false, message: "" },
	},
	// System Related
	timetable: [],
};

export const slice = createSlice({
	name: "slice",
	initialState,
	reducers: {
		// Class Handling
		updateClass: (state, action) => {
			const { lecturer, room, date, code, semester } = action.payload;
			state.classDetails = { lecturer, room, date, code, semester };
		},
		removeClass: (state) => {
			state.classDetails = {
				lecturer: "",
				room: "",
				code: "",
				date: { start: "", end: "" },
				semester: { year: "", period: "" },
			};
		},
		// Location Handling
		updateLocation: (state, action) => {
			const { latitude, longitude } = action.payload;
			state.location = { latitude, longitude };
		},
		// User handling
		updateUser: (state, action) => {
			const { _id, username, email, role, student, school, department } =
				action.payload;
			if (student) {
				state.user = {
					_id,
					username,
					email,
					role,
					student,
					school,
					department,
				};
			} else {
				state.user = { _id, username, email, role, school, department };
			}
		},
		removeUser: (state) => {
			state.user = {
				_id: "",
				username: "",
				email: { address: "", verified: false },
				role: "student",
				student: { year: "", period: "" },
				school: "",
				department: "",
			};
		},
		// Student handling
		updateModal: (state, action) => {
			const { show, message } = action.payload;
			if (state.studentModal) {
				state.studentModal.modal = { show, message };
			}
		},
		removeModal: (state) => {
			if (state.studentModal) {
				state.studentModal.modal = { show: false, message: "" };
			}
		},
		// Polygon handling
		updatePolygon: (state, action) => {
			const { position, location } = action.payload;
			state.polygon = { ...state.polygon, [position]: location };
		},
		updateWholePolygon: (state, action) => {
			const { farRight, farLeft, nearRight, nearLeft } = action.payload;
			state.polygon = { farRight, farLeft, nearRight, nearLeft };
		},
		// Poly handling
		updatePoly: (state, action) => {
			const { position, done } = action.payload;
			state.poly = { ...state.poly, [position]: done };
		},
		updateWholePoly: (state, action) => {
			const { doneRight, doneLeft } = action.payload;
			state.poly = { doneRight, doneLeft };
		},
		removePoly: (state) => {
			state.poly = { doneRight: false, doneLeft: false };
		},
		// Unit handling
		updateUnits: (state, action) => {
			const { units } = action.payload;
			state.units = units;
		},
		removeUnits: (state) => {
			state.units = [];
		},
		// Timetable handling
		updateTimetable: (state, action) => {
			const { timetable } = action.payload;
			state.timetable = timetable;
		},
		removeTimetable: (state) => {
			state.timetable = [];
		},
	},
});

export const {
	updateClass,
	removeClass,
	updateLocation,
	updateUser,
	removeUser,
	updateModal,
	removeModal,
	updatePolygon,
	updateWholePolygon,
	updatePoly,
	updateWholePoly,
	removePoly,
	updateUnits,
	removeUnits,
	updateTimetable,
	removeTimetable,
} = slice.actions;

export default slice.reducer;
