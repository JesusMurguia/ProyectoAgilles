import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect, useCallback } from "react";

import "react-toastify/dist/ReactToastify.css";

function Notificacion({ setActive, propsIsPaused }) {
  const [isPaused, setIsPaused] = useState(false);
  const setActiveButton = () => {
    if (localStorage.getItem("isCountDownActive") != "paused") {
      setActive(true);
    }
  };

  const closeButton = ({ closeToast }) => (
    <button
      onClick={(closeToast, setActiveButton)}
      className="Toastify__close-button Toastify__close-button--light"
    >
      <svg viewBox="0 0 14 12" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <line x1="1" y1="11" x2="11" y2="1" stroke="black" strokeWidth="2" />
        <line x1="1" y1="1" x2="11" y2="11" stroke="black" strokeWidth="2" />
      </svg>
    </button>
  );
  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={false}
        newestOnTop={false}
        // closeOnClick
        closeButton={closeButton}
        rtl={false}
        pauseOnFocusLoss
        draggable
        toastClassName="dark-toast"
      />
    </div>
  );
}

export default Notificacion;
