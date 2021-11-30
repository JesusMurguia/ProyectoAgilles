import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
//Initialize Firebase
firebase.initializeApp({
  apiKey: process.env.REACT_APP_FB_API,
  authDomain: process.env.REACT_APP_FB_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT,
  storageBucket: process.env.REACT_APP_FB_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_SENDER,
  appID: process.env.REACT_APP_FB_APP,
});

const AuthContext = createContext();

//Hook for child components to get the auth object ...
// ... and re-render when it changes
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const createUserWithEmailAndPassword = (email, password, username) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        // Signed in
        const newUser = {
          uid: userCredential.user.uid,
          email: email,
          username: username,
          createdAt: new Date(),
        };
        await createUserDocument(newUser);
        setUser(newUser);
        return true;
      });
  };

  const createUserDocument = async (newUser) => {
    if (!newUser) {
      return false;
    }
    const userRef = firebase.firestore().collection("users").doc(newUser.uid);
    const snap = await userRef.get();

    if (!snap.exists) {
      try {
        await userRef.set({
          uid: newUser.uid,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getUserDocument = async (user) => {
    if (!user) {
      return false;
    }

    const userRef = firebase.firestore().collection("users").doc(user.uid);
    const snap = await userRef.get();

    return snap.exists ? snap.data() : false;
  };

  const signInWithEmailAndPassword = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        // Signed in
        const newUser = await getUserDocument(userCredential.user);
        setUser(newUser);
        // ...
      });
  };

  const logout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      });
  };

  //TODO see if this shit works i just copied from autopilot
  const signInWithGoogle = () => {
    return firebase
      .auth()
      .signInWithPopup(firebase.auth.GoogleAuthProvider.PROVIDER_ID)
      .then((result) => {
        setUser(result.user);
        return true;
      });
  };

  const addTarea = async (tarea) => {
    const userRef = firebase.firestore().collection("users").doc(user.uid);
    const snap = await userRef.get();
    if (snap.exists) {
      if (!snap.data().tareas) {
        await userRef.update({
          tareas: [
            {
              nombre: tarea.nombre.toString(),
              descripcion: tarea.descripcion.toString(),
              estado: tarea.estado.toString(),
              fechaTerminada: tarea.fechaTerminada
                ? tarea.fechaTerminada.toString()
                : "no ha terminado",
            },
          ],
        });
        //  setUser(await getUserDocument(user));
      } else {
        const tareas = snap.data().tareas;
        const nombres = tareas.map((tarea) => tarea.nombre);
        const descripciones = tareas.map((tarea) => tarea.descripcion);
        if (
          nombres.indexOf(tarea.nombre.toString()) === -1 ||
          descripciones.indexOf(tarea.descripcion.toString()) === -1
        ) {
          tareas.push({
            nombre: tarea.nombre.toString(),
            descripcion: tarea.descripcion.toString(),
            estado: tarea.estado.toString(),
            fechaTerminada: tarea.fechaTerminada
              ? tarea.fechaTerminada.toString()
              : "no ha terminado",
          });
          await userRef.update({ tareas });
          // setUser(await getUserDocument(user));
        } else {
          throw new Error("Tarea ya existe");
        }
      }
    }
  };

  const updateTareas = async (tareasList) => {
    let tareas = tareasList.map((tarea) => {
      return {
        nombre: tarea.nombre.toString(),
        descripcion: tarea.descripcion.toString(),
        estado: tarea.estado.toString(),
        fechaTerminada: tarea.fechaTerminada
          ? tarea.fechaTerminada.toString()
          : "no ha terminado",
      };
    });
    const userRef = firebase.firestore().collection("users").doc(user.uid);
    const snap = await userRef.get();
    if (snap.exists) {
      await userRef.update({ tareas });
      //setUser(await getUserDocument(user));
    }
  };

  const deleteTarea = async (tarea) => {
     const userRef = firebase.firestore().collection("users").doc(user.uid);
     const snap = await userRef.get();
     if (snap.exists) {
       const tareas = snap.data().tareas;
       const newTareas = tareas.filter((t) => t.nombre !== tarea.nombre && t.descripcion !== tarea.descripcion);
        await userRef.update({ tareas: newTareas });
        setUser(await getUserDocument(user));
     }
  };

  const updateTarea = async (old,updated) => {
    const userRef = firebase.firestore().collection("users").doc(user.uid);
    const snap = await userRef.get();
    if (snap.exists) {
      const tareas = snap.data().tareas;
      const nombres = tareas.map((tarea) => tarea.nombre);
        const descripciones = tareas.map((tarea) => tarea.descripcion);
        if (nombres.indexOf(updated.nombre.toString()) === -1 && descripciones.indexOf(updated.descripcion.toString()) === -1) {
      const newTareas = tareas.map((t) => {
        if(t.nombre === old.nombre && t.descripcion === old.descripcion){
          return updated;
        } 
        return t;
      });
      await userRef.update({ tareas: newTareas });
      setUser(await getUserDocument(user));
    } else {
      throw new Error("Tarea ya existe");

    }

  };
  }



  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any
  // component that utilizes this hook to re-render with the
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (fbuser) => {
      setUser(await getUserDocument(fbuser));
      setIsAuthenticating(false);
    });

    // Cleanup suscription on unnmount
    return () => unsubscribe();
  }, []);

  const values = {
    user,
    isAuthenticating,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithGoogle,
    addTarea,
    updateTareas,
    logout,
    firebase,
    getUserDocument,
    deleteTarea,
    updateTarea
  };

  return (
    <AuthContext.Provider value={values}>
      {!isAuthenticating && children}
    </AuthContext.Provider>
  );
};
