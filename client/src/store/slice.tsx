import { createSlice } from "@reduxjs/toolkit";

export interface InitialState {
  classDetails: {
    currentClass: string;
    lecturer: string;
    room: string;
    unit: string;
    code: string;
    date: { start: string; end: string };
  };
  location: { lat: number; lon: number };
  user: {
    name: string;
    email: string;
    role: string;
  };
  points: { lat: number; lon: number };
}

const initialState: InitialState = {
  classDetails: {
    currentClass: "",
    lecturer: "",
    room: "",
    unit: "",
    code: "",
    date: { start: "", end: "" },
  },
  location: { lat: 0, lon: 0 },
  user: {
    name: "",
    email: "",
    role: "",
  },
  points: { lat: 0, lon: 0 },
};

export const slice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    // Class Handling
    updateClass: (state, action) => {
      const { currentClass, lecturer, room, unit, date, code } = action.payload;
      state.classDetails = { currentClass, lecturer, room, unit, date, code };
    },
    removeClass: (state) => {
      state.classDetails = {
        currentClass: "",
        lecturer: "",
        room: "",
        unit: "",
        code: "",
        date: { start: "", end: "" },
      };
    },
    // Location Handling
    updateLocation: (state, action) => {
      const { lat, lon } = action.payload;
      state.location = { lat, lon };
    },
    // User handling
    updateUser: (state, action) => {
      const { name, email, role } = action.payload;
      state.user = { name, email, role };
    },
    removeUser: (state) => {
      state.user = { name: "", email: "", role: "" };
    },
    // Point in polygon
    updatePoints: (state, action) => {
      const { lat, lon } = action.payload;
      state.points = { lat, lon };
    },
    removePoints: (state) => {
      state.points = { lat: 0, lon: 0 };
    },
  },
});

export const {
  updateClass,
  removeClass,
  updateLocation,
  updateUser,
  removeUser,
  updatePoints,
  removePoints,
} = slice.actions;

export default slice.reducer;
