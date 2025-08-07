import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarApp = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [clickedDate, setClickedDate] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [result, setResult] = useState(null);

  const data = {
    "06-08-2025": [
      { user_1: 1 },
      { user_2: 2 },
      { user_3: 3 },
      { user_4: 4 },
    ],
    "07-08-2025": [
      { user_1: 1 },
      { user_2: 2 },
      { user_3: 3 },
      { user_4: 4 },
    ],
  };

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, []);

  const handleDateClick = (slotInfo) => {
    console.log("slotInfo",slotInfo);
    const formatted = moment(slotInfo.start).format("DD-MM-YYYY");
         console.log("formatted",formatted);
    setClickedDate(formatted);
    setInputDate(formatted); 
    setShowPopup(true);
    setResult(null);
  };

  const handleOk = () => {
    const stored = JSON.parse(localStorage.getItem("data"));
    const found = stored[inputDate];
     console.log("found",found);

    if (found) {
      setResult(found);
    } else {
      setResult("no-data");
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setResult(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Simple Calendar</h2>
      <Calendar
        localizer={localizer}
        style={{ height: 500 }}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleDateClick}
      />

      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h4>Enter Date</h4>
            <input
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              placeholder="DD-MM-YYYY"
              style={{ padding: 6, width: "90%" }}
            />
            <div style={{ marginTop: 10 }}>
              <button onClick={handleOk}>OK</button>{" "}
              <button onClick={handleCancel}>Cancel</button>
            </div>

            {result && result !== "no-data" && (
              <div style={{ textAlign: "left", marginTop: 10 }}>
                <strong>Data:</strong>
                <ul>
                  {result.map((item, idx) => (
                    <li key={idx}>
                      {Object.keys(item)[0]} : {Object.values(item)[0]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result === "no-data" && (
              <p style={{ color: "red", marginTop: 10 }}>No data found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  popup: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    width: 300,
    textAlign: "center",
  },
};

export default CalendarApp;
