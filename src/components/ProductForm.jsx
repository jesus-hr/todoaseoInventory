import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { registrarMovimiento } from "../movimientos"; // Importamos la función

const ProductForm = () => {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre || !cantidad) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const nuevoProducto = { Nombre: nombre, Cantidad: parseInt(cantidad, 10) };
      await addDoc(collection(db, "Productos"), nuevoProducto);

      // Registrar en historial
      await registrarMovimiento("Agregar", nuevoProducto);

      setNombre("");
      setCantidad("");

      alert("Producto agregado exitosamente!");
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  return (
    <div>
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <br></br>
        <label>Cantidad:</label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />

        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default ProductForm;