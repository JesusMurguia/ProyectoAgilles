import React from "react";
import { Modal, Button, Form, Col, Row, Alert } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
function AddForm(props) {
  let tarea=props.show;
  const { addTarea,deleteTarea } = useAuth();

  //se separa la funcion de setState de los props del modal para evitar un error de renderizado
  const {
    setShowFormError,
    showFormError,
    onSuccess,
    // setIsClickAddTask,
    // getTasks,
    ...propsModal
  } = props;

  //se guardan los nuevos datos editados en un objeto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = {
      nombre: e.target.nombre.value,
      descripcion: e.target.descripcion.value,
      estado: "pendiente",
    };

    await addTarea(obj)
      .then((res) => {
        props.onSuccess();
        // getTasks();
      })
      .catch((err) => {
        props.setShowFormError(err.message);
      });
  };

  return (
    <Modal
      className="modal-add-form"
      {...propsModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Detalles de Tarea
        </Modal.Title>
        <Button
          variant="danger"
          onClick={() => {
            props.onHide();
          }}
        >
          X
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit.bind(this)}>
          <Row>
            <Col md>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" maxLength="100" 
                defaultValue={tarea?.nombre}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripcion</Form.Label>
                <Form.Control
                defaultValue={tarea?.descripcion}
                 as="textarea" rows={3} maxLength="100" />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md>
              {props.showFormError ? (
                <Alert variant="danger" className="mt-3">
                  Ya existe esa tarea
                </Alert>
              ) : null}
            </Col>
          </Row>
          {/* <Row>
            <Col md>
              <Form.Group controlId="Imagen">
                <Form.Label>Status</Form.Label>
                <Form.Select aria-label="select status">
                  <option>Open this select menu</option>
                  <option value="1">Pendiente</option>
                  <option value="2">En progreso</option>
                  <option value="3">Completada</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row> */}

          <Row>
            <Col className="text-center m-4">
              <Button variant="outline-light" type="submit" className="mt-3">
                Editar
              </Button>
            </Col>
            <Col className="text-center m-4">
              <Button
                variant="outline-light"
                onClick={async() => {
                  console.log(tarea);
                   await deleteTarea(tarea).then(() => {
                     props.onSuccess();
                   });
                }}

                className="mt-3"
              >
                Eliminar
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddForm;
