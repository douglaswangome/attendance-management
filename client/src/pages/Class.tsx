import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { InitialState } from "../store/slice";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { BsCheckCircle } from "react-icons/bs";
import Loader from "../components/Loader";

const Class: React.FC = () => {
  const navigate = useNavigate();
  const { classDetails, location, user } = useSelector(
    (state: { slice: InitialState }) => state.slice
  );

  // Get farthest right (of the lecturer) and farthest left (of the lecturer) and create a polygon add 5 meters to the right and left and check if the user is inside the polygon
  // If user is inside the polygon then allow the user to update location

  // Check if state is empty
  useEffect(() => {
    if (classDetails.room === "") {
      navigate("/home");
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap-2 p-2">
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
            {location.lat !== 0 && location.lon !== 0 ? (
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
            <div>
              <span>Allow farthest right student to update location</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Class;
