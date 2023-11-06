const getDirections = (
	degrees: number,
	side: "right" | "left"
): { forward: number; x: number } => {
	let forward: number;
	let x: number;

	if (side === "right") {
		if (degrees > 0 && degrees < 90) {
			forward = 180;
			x = 90 - degrees;
		} else if (degrees > 90 && degrees < 180) {
			forward = 270;
			x = 180 - degrees;
		} else if (degrees > 180 && degrees < 270) {
			forward = 0;
			x = 270 - degrees;
		} else {
			forward = 90;
			x = 360 - degrees;
		}
	} else {
		if (degrees > 0 && degrees < 90) {
			forward = 270;
			x = degrees;
		} else if (degrees > 90 && degrees < 180) {
			forward = 0;
			x = 90 - (180 - degrees);
		} else if (degrees > 180 && degrees < 270) {
			forward = 90;
			x = degrees - 180;
		} else {
			forward = 180;
			x = 90 - (360 - degrees);
		}
	}

	return { forward, x };
};

export default getDirections;
