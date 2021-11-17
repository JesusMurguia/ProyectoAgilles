import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddForm from "../components/AddForm";
import SuccessModal from "../components/SuccessModal";
import { useAuth } from "../hooks/useAuth";
import Tablero from "../components/Tablero";
import CoutDown from "../components/CoutDown";

const HomePage = () => {
  const { user, getUserDocument } = useAuth();

  const [showFormError, setShowFormError] = useState(false);
  const [showAddForm, setShowAddForm] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isClickAddTask, setIsClickAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  //se abre el form de agregar tareas
  const handleAddTask = (game) => {
    setShowAddForm(game);
  };
  const getTasks = async () => {
    await getUserDocument(user).then((value) => {
      setTasks(value.tareas);
      setIsClickAddTask(false);
      setIsloading(false);
    });
  };
  const IsTablero = () => {
    if (tasks && tasks.length > 0) {
      return <Tablero tareasList={tasks} />;
    } else if (!isLoading) {
      return <h3 className="text-center">No hay tareas</h3>;
    } else {
      return <h3 className="text-center">Cargando...</h3>;
    }
  };
  useEffect(() => {
    getTasks();
  }, [isClickAddTask]);
  return (
    <Container>
      <CoutDown tareasList={tasks} />
      <div className="d-flex justify-content-center align-items-center mb-5">
        <h1 className="tareas-title">Tareas</h1>
        <button
          className="btn btn-light btn-add"
          onClick={handleAddTask.bind(this, { estado: "Pendiente" })}
        >
          <FaPlus />
        </button>
      </div>
      {/*
TABLERO DONDE SE MUESTRA LAS TAREAS PENDIENTES Y TAREAS EN PROGRESO
* */}
      <IsTablero />

      {/* FORM PARA AGREGAR UNA TAREA */}
      <AddForm
        game={showAddForm}
        setIsClickAddTask={setIsClickAddTask}
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
      />
      {/* MODAL DE EXITO */}
      <SuccessModal
        title={"Tarea registrada correctamente!"}
        show={showSuccessModal}
        onHide={() => {
          setShowSuccessModal(false);
        }}
      ></SuccessModal>
    </Container>
  );
};

export default HomePage;
