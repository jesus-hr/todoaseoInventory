import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Función para registrar movimientos en Firestore
const registrarMovimiento = async (accion, producto) => {
  try {
    await addDoc(collection(db, "Historial"), {
      Accion: accion, // "Agregar", "Editar" o "Eliminar"
      Producto: producto,
      Timestamp: serverTimestamp(), // Fecha y hora
    });
  } catch (error) {
    console.error("Error registrando movimiento:", error);
  }
};

export { registrarMovimiento };