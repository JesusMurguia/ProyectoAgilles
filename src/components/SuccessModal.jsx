import { Modal, Button } from "react-bootstrap";
function SuccessModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <h4>Tarea registrada correctamente!</h4>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button onClick={props.onHide} variant="outline-light">
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SuccessModal;
