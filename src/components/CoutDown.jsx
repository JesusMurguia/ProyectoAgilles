import React, { useState, useEffect } from "react";
import { Container, Col, Row, Card, Button } from "react-bootstrap";
import SuccessModal from "./SuccessModal";
import Notificacion from "./Notificacion";
import { ToastContainer, toast } from "react-toastify";
import { css } from "glamor";
const CoutDown = ({ tareaProgreso }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const SECONDS = 10;

  function toggle() {
    const isProgreso = tareaProgreso.filter(
      (item) => item.estado == "progreso"
    );

    if (isProgreso.length >= 1) {
      if (!isActive && seconds == 0) {
        dismissAll();
      }
      setIsActive(!isActive);
    } else {
      setShowMessage(true);
    }
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  const dismissAll = () => toast.dismiss();
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        //mostrar notificacion 5 seg antes
        if (seconds == SECONDS - 6) {
          toast("El pomodoro esta por terminarse");
        }
        if (seconds == SECONDS) {
          reset();
        } else {
          setSeconds((seconds) => seconds + 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      console.log("paused");
      //setIsPaused(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  const multipleOnclick = () => {
    reset();
    dismissAll();
  };
  return (
    <>
      <Card bg="danger" className="text-center">
        <Card.Body className="text-center">
          <div className="time">{seconds}s</div>
          <Row className="justify-content-center">
            <Col xs={5} sm={4} md={3}>
              <button
                className={`button button-primary button-primary-${
                  isActive ? "active" : "inactive"
                }`}
                onClick={toggle}
              >
                {isActive ? "Pause" : "Start"}
              </button>
            </Col>
            <Col xs={5} sm={4} md={3}>
              <button className="button" onClick={multipleOnclick}>
                Reset
              </button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* MODAL DE ADVERTENCIA */}
      <SuccessModal
        title={"No hay tarea en progreso"}
        show={showMessage}
        onHide={() => {
          setShowMessage(false);
        }}
      ></SuccessModal>
      <Notificacion setActive={setIsActive} />
    </>
  );
};

export default CoutDown;
