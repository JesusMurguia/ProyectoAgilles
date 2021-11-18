import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, Card, Button } from "react-bootstrap";
import SuccessModal from "./SuccessModal";
import Notificacion from "./Notificacion";
import { toast } from "react-toastify";

import { useAuth } from "../hooks/useAuth";
const CoutDown = ({ tareasList, isMoveProgresTask }) => {
  const { getUserDocument, user } = useAuth();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const SECONDS = 60;

  const getTasks = async () => {
    await getUserDocument(user).then((value) => {
      const isProgreso = value.tareas.filter(
        (item) => item.estado == "progreso"
      );

      if (isProgreso.length >= 1) {
        if (!isActive && seconds == 0) {
          dismissAll();
        }
        setIsActive(!isActive);
        localStorage.setItem("isCountDownActive", true);
      } else {
        setShowMessage(true);
      }
    });
  };
  function reset() {
    setSeconds(0);
    setIsActive(false);
    localStorage.setItem("isCountDownActive", false);
  }
  const offCoutDown = useCallback(async () => {
    reset();
  }, [isMoveProgresTask]);

  useEffect(() => {
    offCoutDown();
  }, [offCoutDown]);
  const dismissAll = () => toast.dismiss();
  useEffect(() => {
    let interval = null;
    if (isActive) {
      localStorage.setItem("isCountDownActive", true);
      interval = setInterval(() => {
        //mostrar notificacion 5 seg antes
        if (seconds == SECONDS - 6) {
          toast("El pomodoro esta por terminarse");
          toast.info("El pomodoro esta por terminarse", {
            position: "bottom-right",
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          });
        }
        if (seconds == SECONDS) {
          reset();
        } else {
          setSeconds((seconds) => seconds + 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      toast.info("El pomodoro se a pausado", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsPaused(true);
      localStorage.setItem("isCountDownActive", "paused");
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  const multipleOnclick = () => {
    reset();
    dismissAll();
  };

  const mostrarBtn = () => {
    if (isActive) {
      return "Pause";
    } else if (!isActive && seconds == 0) {
      return "Start";
    } else if (!isActive && seconds != 0) {
      return "Reanudar";
    }
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
                onClick={getTasks}
              >
                {mostrarBtn()}
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
      <Notificacion setActive={setIsActive} isPaused={isPaused} />
    </>
  );
};

export default CoutDown;
