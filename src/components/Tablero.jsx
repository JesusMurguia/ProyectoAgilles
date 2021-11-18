import React, { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { Container, Col, Row } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import SuccessModal from "./SuccessModal";

const Tablero = (props) => {
  const { updateTareas } = useAuth();

  const [tareasPendientes, setTareasPendientes] = useState([]);
  const [tareasProgreso, setTareasProgreso] = useState([]);
  const [tareasTerminadas, setTareasTerminadas] = useState([]);
  const [showMessageExito, setShowMessageExito] = useState(false);
  const [isTargetFinished, setIsTargetFinished] = useState(false);

  const asignarEstado = (index, estado, from) => {
    switch (from) {
      case "sortable-pendiente":
        tareasPendientes[index].estado = estado;
        break;
      case "sortable-progreso":
        console.log("se movio de tarea progreso");
        tareasProgreso[index].estado = estado;

        break;
      case "sortable-terminada":
        setIsTargetFinished(true);
        tareasTerminadas[index].estado = estado;
        break;
      default:
    }
  };

  useEffect(() => {
    if (localStorage.getItem("setShowMessageExito") == "true") {
      setShowMessageExito(true);
    }
    const getTareas = () => {
      let tareasPendientes = [];
      let tareasProgreso = [];
      let tareasTerminadas = [];

      props.tareasList.forEach((tarea, index) => {
        tarea.index = index;

        switch (tarea.estado) {
          case "progreso":
            tareasProgreso.push(tarea);
            break;
          case "pendiente":
            tareasPendientes.push(tarea);
            break;
          case "terminada":
            tareasTerminadas.push(tarea);
            break;
          default:
        }
      });

      setTareasPendientes(tareasPendientes);
      setTareasProgreso(tareasProgreso);
      setTareasTerminadas(tareasTerminadas);
    };
    getTareas();
  }, [props.tareasList]);
  return (
    <>
      <Row>
        <Col>
          {/*Mostrar tareas en pendiente */}
          <Container className="container-sort">
            <ReactSortable
              className="sortable-pendiente"
              list={tareasPendientes}
              setList={setTareasPendientes}
              group="shared-group-name"
              onEnd={async () => {
                {
                  await updateTareas(
                    tareasPendientes.concat(tareasProgreso, tareasTerminadas)
                  );
                }
              }}
              onAdd={(evt) => {
                asignarEstado(evt.oldIndex, "pendiente", evt.from.className);
              }}
            >
              {tareasPendientes.map((tarea) => (
                <Container key={tarea.index} className="list-container">
                  <Col className="text-list-container">
                    <h3>{tarea.nombre}</h3>
                    <p>{tarea.descripcion}</p>
                    <p>{tarea.estado}</p>
                  </Col>
                </Container>
              ))}
            </ReactSortable>
          </Container>
        </Col>
        <Col>
          {/*Mostrar tareas en progreso */}
          <Container className="container-sort">
            <ReactSortable
              className="sortable-progreso"
              list={tareasProgreso}
              setList={setTareasProgreso}
              draggable=".list-container"
              group="shared-group-name"
              onAdd={(evt) => {
                asignarEstado(evt.oldIndex, "progreso", evt.from.className);
              }}
              onEnd={async (e) => {
                {
                  await updateTareas(
                    tareasPendientes.concat(tareasProgreso, tareasTerminadas)
                  ).then(() => {
                    // console.log(e.from.className);
                    if (localStorage.getItem("isCountDownActive") == "true") {
                      props.setTasks(
                        tareasPendientes.concat(
                          tareasProgreso,
                          tareasTerminadas
                        )
                      );

                      props.setIsMoveProgresTask(!props.isMoveProgresTask);
                    }
                  });
                }
              }}
            >
              {tareasProgreso.map((tarea) => (
                <Container key={tarea.index} className="list-container">
                  <Row>
                    <Col className="text-list-container">
                      <h3>{tarea.nombre}</h3>
                      <p>{tarea.descripcion}</p>
                      <p>{tarea.estado}</p>
                    </Col>
                  </Row>
                </Container>
              ))}
            </ReactSortable>
          </Container>
        </Col>
        <Col>
          {/*Mostrar tareas terminadas */}
          <Container className="container-sort">
            <ReactSortable
              className="sortable-terminada"
              list={tareasTerminadas}
              setList={setTareasTerminadas}
              group="shared-group-name"
              onAdd={(evt) => {
                //setShowMessageExito(true);
                localStorage.setItem("setShowMessageExito", true);
                asignarEstado(evt.oldIndex, "terminada", evt.from.className);
              }}
              onEnd={async () => {
                {
                  await updateTareas(
                    tareasPendientes.concat(tareasProgreso, tareasTerminadas)
                  );
                }
              }}
            >
              {tareasTerminadas.map((tarea) => (
                <Container key={tarea.index} className="list-container">
                  <Col className="text-list-container">
                    <h3>{tarea.nombre}</h3>
                    <p>{tarea.descripcion}</p>
                    <p>{tarea.estado}</p>
                  </Col>
                </Container>
              ))}
            </ReactSortable>
          </Container>
        </Col>
      </Row>
      {/* MODAL DE EXITO POR TERMINAR LA TAREA */}
      <SuccessModal
        title={"Congratulations 👏🎊"}
        show={showMessageExito}
        onHide={() => {
          setShowMessageExito(false);
          localStorage.setItem("setShowMessageExito", false);
        }}
      ></SuccessModal>
    </>
  );
};

export default Tablero;
