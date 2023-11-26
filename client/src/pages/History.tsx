import React from "react";
import { timetable } from "../offline/timetable.json";
import { useSelector } from "react-redux"; // Redux
import { InitialState } from "../store/slice"; // Redux - Slice
import Unit from "../components/Unit";

const History: React.FC = () => {
	const numberOfClasses = timetable.filter(
		(item) => item.code === timetable[0].code
	).length;
	const { units } = useSelector(
		(state: { slice: InitialState }) => state.slice
	);

	return (
		<div className="flex flex-col gap-1 w-full p-2">
			<div className="flex items-center w-fit ml-auto">
				<span className="text-sm ml-2">
					{numberOfClasses} class{numberOfClasses > 1 ? "es" : ""}
				</span>
			</div>
			{units.map((unit, index) => (
				<div
					className="border rounded-lg p-2 dark:border-less-dark"
					key={index}
				>
					<Unit code={unit.code} />
				</div>
			))}
		</div>
	);
};

export default History;
