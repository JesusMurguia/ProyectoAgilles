import React, { useState, useCallback, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { Container, Col, Row } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
const Tablero = (props) => {
  const { updateTareas } = useAuth();
  const [tareasPendientes, setTareasPendientes] = useState([]);
  const [tareasProgreso, setTareasProgreso] = useState([]);
  const [tareas, setTareas] = useState([]);

  const getTareas = useCallback(async () => {
    let tareasPendientes = [];
    let tareasProgreso = [];
    const tareas = props.tareasList.map((tarea, index) => {
      tarea.index = index;
      tarea.estado === "progreso"
        ? tareasProgreso.push(tarea)
        : tareasPendientes.push(tarea);
      return tarea;
    });
    setTareas(tareas);
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
              console.log("move to up or down pendientes");
              console.log(tareasPendientes.concat(tareasProgreso));
              await updateTareas(tareasPendientes.concat(tareasProgreso));
            }}
            onAdd={async (evt) => {
              console.log("move to pendiente");
              console.log(tareasProgreso);
              console.log(evt.item);
              console.log(evt.oldIndex);
              tareasProgreso[evt.oldIndex].estado = "pendiente";

              //obtener el nombre de la tarea
              //   console.log(evt.item.querySelector("h3").innerText);
              //obtener la descripcion de la tarea
              //  console.log(evt.item.querySelector("p").innerText);
              //tareasProgreso[evt.item.dataset.id].estado = "pendiente";
              // await updateTareas(tareasPendientes.concat(tareasProgreso));
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
              console.log("move to progreso");
              console.log(tareasPendientes);
              console.log(evt.item);
              console.log(evt.oldIndex);

              tareasPendientes[evt.oldIndex].estado = "progreso";
              //obtener el nombre de la tarea
              //   console.log(evt.item.querySelector("h3").innerText);
              //obtener la descripcion de la tarea
              // console.log(evt.item.querySelector("p").innerText);
              //tareasPendientes[evt.item.dataset.id].estado = "progreso";
              //  await updateTareas(tareasProgreso.concat(tareasPendientes));
            }}
            onEnd={async () => {
              console.log("move to up or down progreso");
              console.log(tareasPendientes.concat(tareasProgreso));

              await updateTareas(tareasPendientes.concat(tareasProgreso));
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
