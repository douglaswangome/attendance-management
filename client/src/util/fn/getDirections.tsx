const getDirections = (
	degrees: number,
	side: "right" | "left"
): { forward: number; x: number } => {
	let forward: number;
	let x: number;

	if (side === "right") {
		if (degrees > 0 && degrees < 90) {
			// R2
			forward = 180;
			x = 90 - degrees;
		} else if (degrees > 90 && degrees < 180) {
			// R1
			forward = 270;
			x = 180 - degrees;
		} else if (degrees > 180 && degrees < 270) {
			// R4
			forward = 0;
			x = 270 - degrees;
		} else if (degrees > 270 && degrees < 360) {
			// R3
			forward = 90;
			x = 360 - degrees;
		} else {
			throw new Error(
				"GetDirections: Degrees can only be between 0 and 360 except 90, 180, 270"
			);
		}
	} else if (side === "left") {
		if (degrees > 0 && degrees < 90) {
			// L1
			forward = 270;
			x = degrees;
		} else if (degrees > 90 && degrees < 180) {
			// L4
			forward = 0;
			x = degrees - 90;
		} else if (degrees > 180 && degrees < 270) {
			// L3
			forward = 90;
			x = degrees - 180;
		} else if (degrees > 270 && degrees < 360) {
			// L2
			forward = 180;
			x = 90 - (360 - degrees);
		} else {
			throw new Error(
				"GetDirections: Degrees can only be between 0 and 360 except 90, 180, 270"
			);
		}
	} else {
		throw new Error("GetDirections: Side can only be 'right' or 'left'");
	}

	return { forward, x };
};

export default getDirections;
