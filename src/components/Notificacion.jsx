import { ToastContainer } from "react-toastify";
import React from "react";

import "react-toastify/dist/ReactToastify.css";

function Notificacion() {
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
