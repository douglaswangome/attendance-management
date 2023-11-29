import React from "react";
import moment from "moment";
import {
	Document,
	Page,
	Text,
	View,
	Image,
	StyleSheet,
	PDFViewer,
} from "@react-pdf/renderer";
import { Point, User } from "../util/types";

const styles = StyleSheet.create({
	page: {
		backgroundColor: "#fff",
		color: "#000",
		padding: 10,
	},
	section: {
		flexDirection: "column",
		alignItems: "center",
		margin: 1,
		padding: 2,
		flexGrow: 1,
	},
	header: {
		margin: 10,
		width: "100%",
		alignItems: "center",
	},
	headerText: {
		marginVertical: 3,
		fontSize: 14,
		fontWeight: "black",
		textTransform: "uppercase",
	},
	headerDetails: { width: "100%", flexDirection: "column" },
	headerDetailsView: {
		flexDirection: "row",
		width: "100%",
		gap: 2,
	},
	headerDetailsText: {
		marginVertical: 2,
		fontSize: 11,
		fontWeight: "ultrabold",
		textTransform: "uppercase",
	},
	image: { width: 50, height: 50 },
	viewer: {
		width: window.innerWidth,
		height: window.innerHeight,
	},
	table: {
		width: "100%",
		borderStyle: "solid",
		borderColor: "#000000",
		borderWidth: 1,
		borderRightWidth: 0,
		borderBottomWidth: 0,
	},
	tableRow: { margin: 0, width: "100%", flexDirection: "row" },
	tableCol: {
		width: "100%",
		borderStyle: "solid",
		borderColor: "#000000",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
	},
	tableStudentCol: {
		width: "150%",
		borderStyle: "solid",
		borderColor: "#000000",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
	},
	tableCell: { margin: "auto", marginVertical: 3, fontSize: 10 },
});

interface Props {
	students: User[];
	attendance: {
		moment: string;
		attendances: {
			_id: string;
			username: string;
			location: Point;
			present: boolean;
		};
	}[];
}

const Summary: React.FC = () => {
	return (
		<div className="flex flex-col gap-1 w-full p-2">
			show button to download pdf
		</div>
	);
};

export default Summary;
