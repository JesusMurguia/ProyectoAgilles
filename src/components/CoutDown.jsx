import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, Card } from "react-bootstrap";
import SuccessModal from "./SuccessModal";
import Notificacion from "./Notificacion";
import { toast } from "react-toastify";

import { useAuth } from "../hooks/useAuth";
const CoutDown = ({ isMoveProgresTask }) => {
  const SECONDS = 2;

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
          dismissAll();

          if(localStorage.getItem('pomodoroActivo') == 'true'){
            reset();
          }else{
            console.log('no hay pomodoro activo');
            activarPomodoro();
          }
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
    setMinuts(SECONDS / 60);
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

  const CloseButtonTerminado = ({ closeToast }) => (
    <button
      onClick={(closeToast, setActiveButton)}
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
    let pomodoroCount = localStorage.getItem("pomodoroCount") == 'NaN' || 
    localStorage.getItem("pomodoroCount") == null ? 0 : localStorage.getItem("pomodoroCount");
    console.log(pomodoroCount);
    if(pomodoroCount > 3){
      localStorage.setItem("pomodoroCount",1)
    }else{
      localStorage.setItem("pomodoroCount",parseInt(pomodoroCount)+1)
    }
    nextDescanso();
  };
  const nextDescanso = () => {
    let pomodoroCount = localStorage.getItem("pomodoroCount");
    if(pomodoroCount > 3){
      localStorage.setItem("cuantosHastaDescanso",0);
    }else{
      localStorage.setItem("cuantosHastaDescanso",4-parseInt(pomodoroCount));
    }
  };
  const activarDescanso=()=>{
    localStorage.setItem("pomodoroActivo", false);
    localStorage.setItem("descansoActivo",true);
    const cuantosHastaDescanso=localStorage.getItem("cuantosHastaDescanso");
    let seconds=cuantosHastaDescanso > 0 ? 5*60 : 20*60;
    setSeconds(0);
    setMinuts(seconds / 60);
    setIsActive(true);
    localStorage.setItem("isCountDownActive", true);
  }

  const activarPomodoro=()=>{
    localStorage.setItem("pomodoroActivo",true);
    nextPomodoro();
    localStorage.setItem("descansoActivo",false);
    setSeconds(0);
    setMinuts(SECONDS / 60);
    // setMinuts(20*60 / 60);
    setIsActive(true);
    localStorage.setItem("isCountDownActive", true);
    dismissAll();
  }
  useEffect(() => {
    let interval = null;
    if (isActive) {
      localStorage.setItem("isCountDownActive", true);
      interval = setInterval(() => {
        //mostrar notificacion 5 seg antes
        if (minuts * 60 + seconds === 6) {
          toast.info("El pomodoro esta por terminarse");
        }

        //saber si ya termino el pomodoro
        if (minuts * 60 + seconds === 0) {
          if(localStorage.getItem("descansoActivo") === "true"){
            //activarPomodoro();
          }else{
            toast.info(
              "El pomodoro se a terminado, puede tomar un descanso o presione 'omitir'",
              {
                position: "bottom-right",
                autoClose: 300000,
                hideProgressBar: false,
                pauseOnHover: false,
                progress: undefined,
                closeButton: CloseButtonTerminado,
                onClose: () => activarPomodoro(),
              }
            );
            activarDescanso();
          }
          // reset();
          
          
        } else {
          setSeconds((seconds) => seconds - 1);

          if (seconds === 0) {
            setMinuts((minuts) => minuts - 1);
            setSeconds(59);
          }
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
    } else if (!isActive && seconds === 0) {
      return "Start";
    } else if (!isActive && seconds !== 0) {
      return "Reanudar";
    }
  };

  return (
    <>
      {console.log(minuts)}
      <Card bg="danger" className="text-center">
        <Card.Title>
            <h2 className="mt-5">Pomodoro: {localStorage.getItem("pomodoroCount") > 0 ?localStorage.getItem("pomodoroCount"): 0 }</h2>
            {localStorage.getItem("descansoActivo") === "true" ? <p>Estas en descanso</p>: localStorage.getItem("cuantosHastaDescanso") > 0 ?
            <p >Faltan {4-localStorage.getItem("pomodoroCount")} pomodoros para un descanso de 20 minutos 😉</p>:localStorage.getItem("pomodoroCount") > 0 ?<p >Siguiente descanso es de 20 minutos 😉</p>: <p >Presiona Start para iniciar el pomodoro</p>
            }
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
