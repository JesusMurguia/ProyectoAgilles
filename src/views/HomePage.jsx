import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddForm from "../components/AddForm";
import SuccessModal from "../components/SuccessModal";
import { useAuth } from "../hooks/useAuth";
import Tablero from "../components/Tablero";

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

      {/*
TABLERO DONDE SE MUESTRA LAS TAREAS PENDIENTES Y TAREAS EN PROGRESO
* */}
      {user.tareas && user.tareas.length > 0 ? (
        <Tablero tareasList={user.tareas} />
      ) : (
        <h3 className="text-center">No hay tareas</h3>
      )}

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
