const getDegrees = (direction: string): number => {
	const compassToDegrees: { [key: string]: number } = {
		N: 0,
		NNE: 22.5,
		NE: 45,
		ENE: 67.5,
		E: 90,
		ESE: 112.5,
		SE: 135,
		SSE: 157.5,
		S: 180,
		SSW: 202.5,
		SW: 225,
		WSW: 247.5,
		W: 270,
		WNW: 292.5,
		NW: 315,
		NNW: 337.5,
	};

	if (compassToDegrees.hasOwnProperty(direction)) {
		return compassToDegrees[direction];
	} else {
		throw new Error("Invalid Compass Direction");
	}
};

export default getDegrees;
