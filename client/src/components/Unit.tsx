import React, { useEffect, useState } from "react";
import { Progress } from "@material-tailwind/react";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { api } from "../App";
import { UnitProps } from "../util/types";

const Unit: React.FC<UnitProps> = (props) => {
	const [classes, setClasses] = useState<string[]>([]);

	useEffect(() => {
		const fetchClasses = async () => {
			if (props.code === "sco 306") {
				try {
					const classes = await api.post("/get_all_attendance", {
						unit: `${props.code.replace(" ", "").toUpperCase()}`,
					});
					setClasses(classes.data);
				} catch (error) {
					console.log(error);
				}
			}
		};

		fetchClasses();
	}, []);

	return (
		<div className="flex flex-col">
			<span className="uppercase">{props.code}</span>
			<Progress
				color="indigo"
				value={90}
				variant="gradient"
				size="sm"
				className="rounded-full text-white"
				label="attendance | 12 of 14"
			>
				{90}%
			</Progress>
			<div className="flex flex-col">
				{classes.map((custom, index) => (
					<div className="flex flex-col p-1 gap-1" key={index}></div>
				))}
				<div className="flex items-center p-1 gap-1">
					Day 1 2023/11/24
					<BsCheckCircle />
				</div>
				<div className="flex items-center p-1 gap-1">
					Day 2 2023/11/24
					<BsXCircle />
				</div>
				<span>Day 3 2023/11/24</span>
				<span>Day 4 2023/11/24</span>
				<span>Day 5 2023/11/24</span>
				<span>Day 6 2023/11/24</span>
				<span>Day 7 2023/11/24</span>
				<span>Day 8 2023/11/24</span>
				<span>Day 9 2023/11/24</span>
				<span>Day 10 2023/11/24</span>
				<span>Day 11 2023/11/24</span>
				<span>Day 12 2023/11/24</span>
				<span className="text-primary">Day 13 2023/11/24</span>
				<span className="text-primary">Day 14 2023/11/24</span>
			</div>
		</div>
	);
};

export default Unit;
