import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { InitialState, updateModal, updatePolygon } from "../store/slice";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import Loader from "../components/Loader";
import { socket } from "../App";
import { useDispatch } from "react-redux";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { getEitherPolygonSide } from "../util/fn/getEitherPolygonSide";

const Class: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classDetails, location, user, student } = useSelector(
    (state: { slice: InitialState }) => state.slice
  );

  // Get farthest right (of the lecturer) and farthest left (of the lecturer) and create a polygon add 5 meters to the right and left and check if the user is inside the polygon
  // If user is inside the polygon then allow the user to update location
  // Emit a "notification" to the "room"
  const emitNotification = () => {
    socket.emit("send_notification", {
      room: classDetails.code.replace(" ", ""),
      message: "Are you the farthest right student?",
    });
  };

  // Check for receive notification for users
  useEffect(() => {
    if (user.role === "student") {
      socket.on("notification", (data) => {
        dispatch(updateModal({ show: true, message: data.message }));
      });
    } else if (user.role === "admin") {
      // update far right and near right polygon data
      socket.on("polygon", (data) => {
        const { near, far, side } = getEitherPolygonSide(
          location,
          data.location,
          "right"
        );
        if (side === "right") {
          dispatch(updatePolygon({ nearRight: near, farRight: far }));
        } else {
          dispatch(updatePolygon({ nearLeft: near, farLeft: far }));
        }
      });
    }
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
        <div className="flex flex-col pl-2 capitalize">
          <div className="flex items-center gap-1 normal-case">
            {location.latitude !== 0 && location.longitude !== 0 ? (
              <>
                <BsCheckCircle className="text-green-600" />
                <span>Your location has been updated</span>
                <span>
                  {location.latitude} {location.longitude}
                </span>
              </>
            ) : (
              <>
                <Loader />
                <span>Fetching your location</span>
              </>
            )}
          </div>
          {user.role === "admin" ? (
            <div>
              <span className="flex gap-1 normal-case">
                <span
                  className="underline cursor-pointer"
                  onClick={emitNotification}
                >
                  Click
                </span>
                to allow farthest right student to update location
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Class;
