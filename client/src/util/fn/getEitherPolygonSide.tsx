import computeDestinationPoint from "geolib/es/computeDestinationPoint";
import getCompassDirection from "geolib/es/getCompassDirection";
import getPreciseDistance from "geolib/es/getPreciseDistance";
import isPointInPolygon from "geolib/es/isPointInPolygon";

interface CompassToDegreesMapping {
  [key: string]: number;
}
interface Point {
  latitude: number;
  longitude: number;
}

interface Return {
  near: Point;
  far: Point;
  side: "right" | "left";
}

const getDegrees = (direction: string): number => {
  const compassToDegrees: CompassToDegreesMapping = {
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

const getEitherPolygonSide = (
  a: Point,
  b: Point,
  side: "right" | "left"
): Return => {
  let near: Point;
  let far: Point;

  const distance = getPreciseDistance(a, b, 0.0001);
  const direction = getCompassDirection(a, b);
  const bearing = getDegrees(direction);
  let degrees: number;
  let forward: number;

  if (bearing > 0 && bearing < 90) {
    degrees = bearing;
  } else if (bearing > 90 && bearing < 180) {
    degrees = 180 - bearing;
  } else {
    degrees = 0;
  }

  if (bearing >= 0 && bearing <= 180) {
    forward = 270;
  } else {
    forward = 90;
  }

  const destinationDistance = distance * Math.sin(degrees);
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
  return { near, far, side };
};

export { getEitherPolygonSide };
