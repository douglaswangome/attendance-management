import React, { useEffect } from "react";
import { socket } from "../App"; // Socket
import { useNavigate } from "react-router-dom"; // React Router - Navigation
import { useSelector } from "react-redux"; // Redux
import { useDispatch } from "react-redux"; // Redux
import {
  initialState,
  InitialState,
  updateModal,
  updatePolygon,
} from "../store/slice"; // Redux - Slice
import isPointInPolygon from "geolib/es/isPointInPolygon"; // Geolib
import { getEitherPolygonSide, Point } from "../util/fn/getEitherPolygonSide"; // Get Either Polygon Side
import moment from "moment/moment"; // Moment - Show Date
import { BsCheckCircle, BsPinMap, BsXCircle } from "react-icons/bs"; // Icons
import Loader from "../components/Loader"; // Loader Component
import Modal from "../components/Modal"; // Modal Component
import Button from "../components/Button"; // Button Component
import notify from "../util/notify"; // Notification Component

const Class: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classDetails, location, polygon, user, student } = useSelector(
    (state: { slice: InitialState }) => state.slice
  );

  // Admin - Emit Notification to Students
  const emitNotification = (side: "right" | "left") => {
    if (side === "right") {
      socket.emit("send_notification", {
        room: classDetails.code.replace(" ", ""),
        message: "Are you the farthest right student?",
      });
    } else {
      socket.emit("send_notification", {
        room: classDetails.code.replace(" ", ""),
        message: "Are you the farthest left student?",
      });
    }
  };
  // Admin Send Polygon Points
  const sendPolygonPoints = () => {
    socket.emit("send_polygon", {
      room: classDetails.code.replace(" ", ""),
      polygon: polygon,
    });
  };
  // Student - Check if location is in polygon
  const checkLocation = (location: Point): boolean => {
    notify(
      "",
      "We will check use your location three times. To make sure you're in the right place "
    );
    // if () {}
    return true;
  };

  // Get Notifications
  useEffect(() => {
    if (user.role === "student") {
      socket.on("notification", (data) => {
        dispatch(updateModal({ show: true, message: data }));
      });

      socket.on("polygon_markers", (data) => {
        dispatch(updatePolygon(data.polygon));
        notify("", "Polygon has been updated. You can now mark your location");
      });
    } else if (user.role === "admin") {
      socket.on("polygon", (data) => {
        const { near, far } = getEitherPolygonSide(location, data.location);
        if (data.side === "right") {
          // update far right and near right polygon data
          dispatch(updatePolygon({ position: "nearRight", location: near }));
          dispatch(updatePolygon({ position: "farRight", location: far }));
        } else {
          // update far left and near left polygon data
          dispatch(updatePolygon({ position: "nearLeft", location: near }));
          dispatch(updatePolygon({ position: "farLeft", location: far }));
        }
      });
    }

    // CleanUp - Remove listeners
    return () => {
      socket.off("notification");
      socket.off("polygon_markers");
      socket.off("polygon");
    };
  }, [socket]);

  // Check if state is empty for all users
  useEffect(() => {
    if (classDetails.room === "") {
      navigate("/home");
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap-2 p-2">
      {user.role === "student" && student.modal ? (
        <Modal show={student.modal.show}>
          <div className="flex flex-col gap-2">
            <span>{student.modal.message}</span>
            <div className="flex items-center gap-2">
              <Button
                icon={BsXCircle}
                text="No"
                fn={() => dispatch(updateModal({ modal: false }))}
                solid
                hover={false}
              />
              <Button
                icon={BsCheckCircle}
                text="Yes"
                fn={() => {
                  socket.emit("update_polygon", {
                    room: classDetails.code.replace(" ", ""),
                    location: location,
                    side: student.modal.message.split(" ")[4],
                  });
                  dispatch(updateModal({ modal: false }));
                }}
                hover={false}
              />
            </div>
          </div>
        </Modal>
      ) : null}
      <div className="flex flex-col">
        <span className="text-xl underline">Class Details</span>
        <div className="flex flex-col pl-2 capitalize">
          <div className="flex gap-2">
            <span>Unit:</span>
            <span className="flex gap-1">
              {classDetails.unit}
              <span className="uppercase">({classDetails.code})</span>
            </span>
          </div>
          <div className="flex gap-2">
            <span>Lecturer:</span>
            <span>
              {classDetails.lecturer}{" "}
              {classDetails.lecturer.toLowerCase() === user.name.toLowerCase()
                ? "(You)"
                : ""}
            </span>
          </div>
          <div className="flex gap-2">
            <span>Room:</span>
            <span>{classDetails.room}</span>
          </div>
          <div className="flex gap-2">
            <span>Date:</span>
            <div className="flex flex-col">
              <div className="flex gap-1">
                <span>Started @</span>
                <span>
                  {moment(classDetails.date.start, "YYYYMMDDHHmm").format(
                    "YYYY/MM/DD HH:mm"
                  )}
                </span>
              </div>
              <div className="flex gap-1">
                <span>Ending @</span>
                <span>
                  {moment(classDetails.date.end, "YYYYMMDDHHmm").format(
                    "YYYY/MM/DD HH:mm"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl underline">Location Details</span>
        <div className="flex flex-col capitalize">
          <div className="flex items-center gap-1 normal-case">
            {location.latitude !== 0 && location.longitude !== 0 ? (
              <>
                <BsCheckCircle className="text-green-600" />
                <span>Your location has been updated</span>
              </>
            ) : (
              <>
                <Loader />
                <span>Fetching your location</span>
              </>
            )}
          </div>
          {user.role === "admin" ? (
            <div className="flex flex-col gap-2">
              <span className="underline">Polygon Details</span>
              <div className="flex flex-col gap-1 ml-2">
                <div className="flex gap-2">
                  <Button
                    hover={false}
                    icon={BsPinMap}
                    text="right"
                    solid
                    fn={() => emitNotification("right")}
                    width="fit"
                  />
                  <div className="flex items-center gap-1">
                    {polygon.farRight.latitude !== 0 &&
                    polygon.farRight.longitude !== 0 ? (
                      <>
                        <BsCheckCircle className="text-green-600" />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <Loader />
                        <span>Fetching location</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    hover={false}
                    icon={BsPinMap}
                    text="left"
                    solid
                    fn={() => emitNotification("left")}
                    width="fit"
                  />
                  <div className="flex items-center gap-1">
                    {polygon.farLeft.latitude !== 0 &&
                    polygon.farLeft.longitude !== 0 ? (
                      <>
                        <BsCheckCircle className="text-green-600" />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <Loader />
                        <span>Fetching location</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 normal-case">
                  {polygon.farLeft === initialState.polygon.farLeft &&
                  polygon.nearLeft === initialState.polygon.nearLeft &&
                  polygon.farRight === initialState.polygon.farRight &&
                  polygon.nearRight === initialState.polygon.nearRight ? (
                    <>
                      <BsXCircle className="text-red-600" />
                      <span>Polygon is not ready</span>
                    </>
                  ) : (
                    <>
                      <BsCheckCircle className="text-green-600" />
                      <span className="flex gap-1">Polygon is ready</span>
                      <Button
                        icon={BsCheckCircle}
                        text="Send"
                        fn={sendPolygonPoints}
                        hover={false}
                        solid
                        width="fit"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Add student location when polygon is ready
            <div className="flex flex-col gap-2">
              <span>Add Location</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Class;
