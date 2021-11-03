import React, { useState, useCallback, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { Container, Col } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
const Tareas = (props) => {
  const { updateTareas } = useAuth();
  const [tareas, setTareas] = useState([]);

  const getTareas = useCallback(async () => {
    const tmptareas = props.tareasList.map((tarea, index) => {
      tarea.index = index;
      return tarea;
    });
    setTareas(tmptareas);
  }, [props.tareasList]);

  useEffect(() => {
    getTareas();

    return () => {
      setTareas([]);
    };
  }, [getTareas]);

  return (
    <Container className="container-sort">
      <ReactSortable
        list={tareas}
        setList={setTareas}
        className="backlog-div"
        animation={100}
        easing="cubic-bezier(1, 0, 0, 1)"
        dragoverBubble={true}
        delayOnTouchStart={true}
        group="shared"
        ghostClass="ghost-class"
        revertOnSpill={true}
        onEnd={async () => {
          await updateTareas(tareas);
        }}
      >
        {tareas.map((tarea) => (
          <Container key={tarea.index} className="list-container">
            <Col className="text-list-container">
              <h3>{tarea.nombre}</h3>
              <p>{tarea.descripcion}</p>
            </Col>
          </Container>
        ))}
      </ReactSortable>
    </Container>
  );
};

export default Tareas;
