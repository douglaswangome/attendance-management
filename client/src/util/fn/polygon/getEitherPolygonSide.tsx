import computeDestinationPoint from "geolib/es/computeDestinationPoint";
import getCompassDirection from "geolib/es/getCompassDirection";
import getPreciseDistance from "geolib/es/getPreciseDistance";
import getDegrees from "./getDegrees";
import getDirections from "./getDirections";
import { Point } from "../../types";

const getEitherPolygonSide = (
	a: Point,
	b: Point,
	side: "right" | "left"
): { near: Point; far: Point } => {
	let near: Point;
	let far: Point;

	// Calculate Near
	const direction = getCompassDirection(a, b);
	const degrees = getDegrees(direction);
	const { forward, x } = getDirections(degrees, side);

	const destinationDistance = getPreciseDistance(a, b, 0.0001) * Math.sin(x);
	const destinationCoordinates = computeDestinationPoint(
		b,
		destinationDistance,
		forward
	);

	if (
		direction === "E" ||
		direction === "ESE" ||
		direction === "SW" ||
		direction === "WSW" ||
		direction === "NW" ||
		direction === "NNW"
	) {
		near = {
			latitude: a.latitude,
			longitude: destinationCoordinates.longitude,
		};
	} else {
		near = {
			latitude: destinationCoordinates.latitude,
			longitude: a.longitude,
		};
	}

	far = b;
	return { near, far };
};

export { getEitherPolygonSide };
