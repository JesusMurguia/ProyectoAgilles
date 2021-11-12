import React, { useState, useEffect } from "react";
import { Container, Col, Row, Card, Button } from "react-bootstrap";
import SuccessModal from "./SuccessModal";
const CoutDown = ({ tareaProgreso }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  function toggle() {
    const isProgreso = tareaProgreso.filter(
      (item) => item.estado == "progreso"
    );

    if (isProgreso.length >= 1) {
      setIsActive(!isActive);
    } else {
      setShowMessage(true);
    }
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

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
              <button className="button" onClick={reset}>
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
    </>
  );
};

export default CoutDown;
