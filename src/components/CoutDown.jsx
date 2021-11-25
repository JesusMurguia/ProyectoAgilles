import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, Card } from "react-bootstrap";
import SuccessModal from "./SuccessModal";
import Notificacion from "./Notificacion";
import { toast } from "react-toastify";

import { useAuth } from "../hooks/useAuth";
const CoutDown = ({ isMoveProgresTask }) => {
  const SECONDS = 20 * 60;

  const { getUserDocument, user } = useAuth();
  const [seconds, setSeconds] = useState(0);
  const [minuts, setMinuts] = useState(SECONDS / 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const getTasks = async () => {
    await getUserDocument(user).then((value) => {
      const isProgreso = value.tareas.filter(
        (item) => item.estado === "progreso"
      );

      if (isProgreso.length >= 1) {
        if (!isActive && seconds === 0) {
          //dismissAll();

          if (localStorage.getItem("pomodoroActivo") == "true") {
            reset();
          } else if (localStorage.getItem("descansoActivo") == "true") {
            console.log("reaundar despues de descanso");
            activarDespuesDeDescanso();
          } else {
            console.log("no hay pomodoro activo");
            activarPomodoro();
          }
        } else {
          setIsActive(!isActive);
          localStorage.setItem("isCountDownActive", true);
        }
      } else {
        setShowMessage(true);
      }
    });
  };
  function reset() {
    localStorage.setItem("pomodoroActivo", false);
    localStorage.setItem("pomodoroCount", 0);
    localStorage.setItem("cuantosHastaDescanso", 0);
    localStorage.setItem("descansoActivo", false);
    setIsActive(false);
    setSeconds(0);
    setMinuts(SECONDS / 60);
    localStorage.setItem("isCountDownActive", false);
  }
  const offCoutDown = useCallback(async () => {
    reset();
  }, [isMoveProgresTask]);

  useEffect(() => {
    offCoutDown();
  }, [offCoutDown]);
  const dismissAll = () => toast.dismiss();

  const CloseButtonTerminado = ({ closeToast }) => (
    <button
      onClick={(closeToast, activarPomodoro)}
      className="Toastify__close-button Toastify__close-button--light"
    >
      <i>omitir</i>
    </button>
  );
  const setActiveButton = () => {
    if (localStorage.getItem("isCountDownActive") !== "paused") {
      setIsActive(true);
    }
  };
  const nextPomodoro = () => {
    let pomodoroCount =
      localStorage.getItem("pomodoroCount") == "NaN" ||
      localStorage.getItem("pomodoroCount") == null
        ? 0
        : localStorage.getItem("pomodoroCount");
    console.log(pomodoroCount);
    if (pomodoroCount > 3) {
      localStorage.setItem("pomodoroCount", 1);
    } else {
      localStorage.setItem("pomodoroCount", parseInt(pomodoroCount) + 1);
    }
    nextDescanso();
  };
  const nextDescanso = () => {
    let pomodoroCount = localStorage.getItem("pomodoroCount");
    if (pomodoroCount > 3) {
      localStorage.setItem("cuantosHastaDescanso", 0);
    } else {
      localStorage.setItem("cuantosHastaDescanso", 4 - parseInt(pomodoroCount));
    }
  };
  const activarDescanso = () => {
    setIsActive(false);
    localStorage.setItem("isCountDownActive", false);

    localStorage.setItem("pomodoroActivo", false);
    localStorage.setItem("descansoActivo", true);
    const cuantosHastaDescanso = localStorage.getItem("cuantosHastaDescanso");
    let seconds = cuantosHastaDescanso > 0 ? 5 * 60 : 20 * 60;
    setSeconds(0);
    setMinuts(seconds / 60);
    setIsActive(true);
    localStorage.setItem("isCountDownActive", true);
  };

  const activarDespuesDeDescanso = () => {
    nextPomodoro();
    localStorage.setItem("pomodoroActivo", true);
    localStorage.setItem("descansoActivo", false);

    setSeconds(0);
    setMinuts(SECONDS / 60);
    setIsActive(true);
    localStorage.setItem("isCountDownActive", true);

    dismissAll();
  };
  const activarPomodoro = () => {
    nextPomodoro();
    console.log("activar pomodoro");
    setIsActive(false);
    localStorage.setItem("isCountDownActive", false);
    setSeconds(0);
    setMinuts(SECONDS / 60);

    localStorage.setItem("pomodoroActivo", true);
    localStorage.setItem("descansoActivo", false);

    setIsActive(true);
    localStorage.setItem("isCountDownActive", true);

    dismissAll();
  };
  useEffect(() => {
    let interval = null;
    console.log(isActive);
    if (isActive) {
      localStorage.setItem("isCountDownActive", true);
      if (localStorage.getItem("pomodoroActivo") == "true") {
        interval = setInterval(() => {
          //mostrar notificacion 5 seg antes
          if (minuts * 60 + seconds === 6) {
            if (localStorage.getItem("descansoActivo") == "false")
              toast.info("El pomodoro esta por terminarse");
          }

          //saber si ya termino el pomodoro
          if (minuts * 60 + seconds === 0) {
            if (localStorage.getItem("descansoActivo") === "true") {
              console.log("coca1");
              //activarPomodoro();
              setIsActive(true);
              localStorage.setItem("isCountDownActive", true);
            } else {
              console.log("coca2");
              if (localStorage.getItem("descansoActivo") == "false") {
                toast.info(
                  "El pomodoro se a terminado, puede tomar un descanso o presione 'omitir'",
                  {
                    position: "bottom-right",
                    hideProgressBar: false,
                    pauseOnHover: false,
                    progress: undefined,
                    closeButton: CloseButtonTerminado,
                    //  onClose: () => activarPomodoro(),
                  }
                );
                activarDescanso();
              }
            }
            // reset();
          } else {
            setSeconds((seconds) => seconds - 1);

            if (seconds === 0) {
              setMinuts((minuts) => minuts - 1);
              setSeconds(59);
            }
          }
        }, 10);
      } else if (localStorage.getItem("descansoActivo") == "true") {
        interval = setInterval(() => {
          //mostrar notificacion 5 seg antes
          if (minuts * 60 + seconds === 6) {
            //toast.info("El descanso esta por terminarse");
          }

          //saber si ya termino el pomodoro
          if (minuts * 60 + seconds === 0) {
            setSeconds(0);
            setMinuts(0);
            setIsActive(false);
            localStorage.setItem("isCountDownActive", false);
          } else {
            setSeconds((seconds) => seconds - 1);

            if (seconds === 0) {
              setMinuts((minuts) => minuts - 1);
              setSeconds(59);
            }
          }
        }, 10);
      }
    } else if (!isActive && seconds !== 0) {
      toast.info("El pomodoro se a pausado", {
        position: "bottom-right",
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
    } else if (!isActive && seconds === 0) {
      return "Start";
    } else if (!isActive && seconds !== 0) {
      return "Reanudar";
    }
  };

  return (
    <>
      <Card bg="danger" className="text-center">
        <Card.Title>
          {localStorage.getItem("descansoActivo") === "true" ? (
            <h2 className="mt-5">Descanso</h2>
          ) : (
            <h2 className="mt-5">
              Pomodoro:{" "}
              {localStorage.getItem("pomodoroCount") > 0
                ? localStorage.getItem("pomodoroCount")
                : 0}
            </h2>
          )}
          {localStorage.getItem("cuantosHastaDescanso") > 0 ? (
            <p>
              Faltan {4 - localStorage.getItem("pomodoroCount")} pomodoros para
              un descanso de 20 minutos 😉
            </p>
          ) : localStorage.getItem("pomodoroCount") > 0 ? (
            <p>Siguiente descanso es de 20 minutos 😉</p>
          ) : (
            <p>Presiona Start para iniciar el pomodoro</p>
          )}
        </Card.Title>
        <Card.Body className="text-center">
          <div className="time">
            {minuts < 10 ? `0${minuts}` : minuts}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </div>
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
              <button className="button" onClick={() => multipleOnclick()}>
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
