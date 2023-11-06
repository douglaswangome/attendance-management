import computeDestinationPoint from "geolib/es/computeDestinationPoint";
import getCompassDirection from "geolib/es/getCompassDirection";
import getPreciseDistance from "geolib/es/getPreciseDistance";
import getDegrees from "./getDegrees";
import getDirections from "./getDirections";

export interface Point {
	latitude: number;
	longitude: number;
}

const getEitherPolygonSide = (
	a: Point,
	b: Point,
	side: "right" | "left"
): { near: Point; far: Point } => {
	// Get the distance
	const distance = getPreciseDistance(a, b, 0.0001);
	const direction = getCompassDirection(a, b);

	// Handle degrees from the direction
	const bearing = getDegrees(direction);

	// Handle direction from the bearing
	const { forward, x } = getDirections(bearing, side);
	const h = distance * Math.sin(x) + 0.1 + 0.22360679775;

	// Get behind the far/b point
	const behind = computeDestinationPoint(b, 0.1, bearing);
	const destination = computeDestinationPoint(behind, h, forward);

	return { near: destination, far: behind };
};

export { getEitherPolygonSide };
