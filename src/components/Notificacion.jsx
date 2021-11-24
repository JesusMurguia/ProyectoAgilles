import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect, useCallback } from "react";

import "react-toastify/dist/ReactToastify.css";

function Notificacion({ setActive }) {
  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={false}
        newestOnTop={false}
        // closeOnClick
        //closeButton={closeButton}
        rtl={false}
        pauseOnFocusLoss
        draggable
        toastClassName="dark-toast"
      />
    </div>
  );
}

export default Notificacion;
