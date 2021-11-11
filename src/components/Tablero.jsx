import React, { useState, useCallback, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { Container, Col, Row } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
const Tablero = (props) => {
  const { updateTareas } = useAuth();
  const [tareasPendientes, setTareasPendientes] = useState([]);
  const [tareasProgreso, setTareasProgreso] = useState([]);

  const getTareas = useCallback(async () => {
    let tareasPendientes = [];
    let tareasProgreso = [];
    props.tareasList.map((tarea, index) => {
      tarea.index = index;
      tarea.estado === "progreso"
        ? tareasProgreso.push(tarea)
        : tareasPendientes.push(tarea);
      return tarea;
    });

    setTareasPendientes(tareasPendientes);
    setTareasProgreso(tareasProgreso);
  }, [props.tareasList]);

  useEffect(() => {
    getTareas();
    return () => {
      setTareasPendientes([]);
      setTareasProgreso([]);
    };
  }, [getTareas]);

  return (
    <Row>
      <Col>
        {/*Mostrar tareas en pendiente */}
        <Container className="container-sort">
          <ReactSortable
            className="sortable"
            list={tareasPendientes}
            setList={setTareasPendientes}
            group="shared-group-name"
            onEnd={async () => {
              await updateTareas(tareasPendientes.concat(tareasProgreso));
            }}
            onAdd={async (evt) => {
              tareasProgreso[evt.item.dataset.id].estado = "pendiente";
              await updateTareas(tareasPendientes.concat(tareasProgreso));
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
            className="sortable"
            list={tareasProgreso}
            setList={setTareasProgreso}
            group="shared-group-name"
            onAdd={async (evt) => {
              tareasPendientes[evt.item.dataset.id].estado = "progreso";
              await updateTareas(tareasProgreso.concat(tareasPendientes));
            }}
            onEnd={async () => {
              await updateTareas(tareasProgreso.concat(tareasPendientes));
            }}
          >
            {tareasProgreso.map((tarea) => (
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
  );
};

export default Tablero;
