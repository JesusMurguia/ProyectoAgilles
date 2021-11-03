import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddForm from "../components/AddForm";
import SuccessModal from "../components/SuccessModal";
import { useAuth } from "../hooks/useAuth";
import Tareas from "../components/Tareas";

const HomePage = () => {
  const { user } = useAuth();

  const [showFormError, setShowFormError] = useState(false);
  const [showAddForm, setShowAddForm] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  //se abre el form de agregar tareas
  const handleAddTask = (game) => {
    setShowAddForm(game);
  };

  return (
    <Container>
      <div className="d-flex justify-content-center align-items-center mb-5">
        <h1 className="tareas-title">Tareas</h1>
        <button
          className="btn btn-light btn-add"
          onClick={handleAddTask.bind(this, { sport: "soccerGames" })}
        >
          <FaPlus />
        </button>
      </div>

      <Row>
        <Col>
          <Tareas tareasList={user.tareas} />
        </Col>
      </Row>
      {/* FORM PARA AGREGAR UNA TAREA */}
      <AddForm
        game={showAddForm}
        animation={false}
        show={Boolean(showAddForm)}
        onHide={() => {
          setShowAddForm(null);
          setShowFormError(null);
        }}
        onSuccess={() => {
          setShowAddForm(null);
          setShowSuccessModal(true);
          setShowFormError(null);
        }}
        showFormError={showFormError}
        setShowFormError={setShowFormError}
      ></AddForm>

      {/* MODAL DE EXITO */}
      <SuccessModal
        show={showSuccessModal}
        onHide={() => {
          setShowSuccessModal(false);
        }}
      ></SuccessModal>
    </Container>
  );
};

export default HomePage;
