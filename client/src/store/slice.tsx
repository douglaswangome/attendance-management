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
  location: { latitude: number; longitude: number };
  user: {
    name: string;
    email: string;
    role: string;
  };
  student: { modal: { show: boolean; message: string } };
  polygon: {
    farRight: { latitude: number; longitude: number };
    farLeft: { latitude: number; longitude: number };
    nearRight: { latitude: number; longitude: number };
    nearLeft: { latitude: number; longitude: number };
  };
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
  location: { latitude: 0, longitude: 0 },
  user: {
    name: "",
    email: "",
    role: "",
  },
  student: { modal: { show: false, message: "" } },
  polygon: {
    farRight: { latitude: 0, longitude: 0 },
    farLeft: { latitude: 0, longitude: 0 },
    nearRight: { latitude: 0, longitude: 0 },
    nearLeft: { latitude: 0, longitude: 0 },
  },
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
      const { latitude, longitude } = action.payload;
      state.location = { latitude, longitude };
    },
    // User handling
    updateUser: (state, action) => {
      const { name, email, role } = action.payload;
      state.user = { name, email, role };
    },
    removeUser: (state) => {
      state.user = { name: "", email: "", role: "" };
    },
    // Student handling
    updateModal: (state, action) => {
      const { show, message } = action.payload;
      state.student.modal = { show, message };
    },
    removeModal: (state) => {
      state.student.modal = { show: false, message: "" };
    },
    // Polygon handling
    updatePolygon: (state, action) => {
      const { position, location } = action.payload;
      state.polygon = { ...state.polygon, [position]: location };
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
} = slice.actions;

export default slice.reducer;
