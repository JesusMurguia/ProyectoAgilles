import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddForm from "../components/AddForm";
import SuccessModal from "../components/SuccessModal";
import { useAuth } from "../hooks/useAuth";
import Tablero from "../components/Tablero";
import CoutDown from "../components/CoutDown";
import EditForm from "../components/EditForm";

const HomePage = () => {
  const { user, firebase } = useAuth();

  const [showEditForm, setShowEditForm] = useState(false);
  const [showFormError, setShowFormError] = useState(false);
  const [showAddForm, setShowAddForm] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [isMoveProgresTask, setIsMoveProgresTask] = useState(false);

  //se abre el form de agregar tareas
  const handleAddTask = (game) => {
    setShowAddForm(game);
  };

  const getTasks = async () => {
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot((value) => {
        setTasks(value.data().tareas);
        //   setIsClickAddTask(false);
        setIsloading(false);
      });
  };
  const IsTablero = () => {
    if (tasks && tasks.length > 0) {
      return (
        <Tablero
          setIsMoveProgresTask={setIsMoveProgresTask}
          isMoveProgresTask={isMoveProgresTask}
          tareasList={tasks}
          setTasks={setTasks}
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
        />
      );
    } else if (!isLoading) {
      return <h3 className="text-center">No hay tareas</h3>;
    } else if (isLoading) {
      return <h3 className="text-center">Cargando...</h3>;
    }
  };

  //use effect para saber cuando se agrego una nueva tarea
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Container>
      <CoutDown tareasList={tasks} isMoveProgresTask={isMoveProgresTask} />
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
        //getTasks={getTasks}
        animation={false}
        show={Boolean(showAddForm)}
        onHide={() => {
          setShowAddForm(null);
          setShowFormError(null);
        }}
        onSuccess={() => {
          setShowAddForm(null);
          setShowSuccessModal("Tarea registrada correctamente");
          setShowFormError(null);
        }}
        showFormError={showFormError}
        setShowFormError={setShowFormError}
      />
      {/* MODAL DE EXITO */}
      <SuccessModal
        title={showSuccessModal}
        show={showSuccessModal}
        onHide={() => {
          setShowSuccessModal("");
        }}
      ></SuccessModal>
      {/* FORM PARA EDITAR UNA TAREA */}
      <EditForm
        show={showEditForm}
        onHide={() => {
          setShowEditForm(false);
        }}
        showMessage={(title) => {
          setShowEditForm(false);
          setShowSuccessModal(title);
        }}
      />
    </Container>
  );
};

export default HomePage;
