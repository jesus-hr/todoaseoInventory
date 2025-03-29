import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

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
      await addDoc(collection(db, "Productos"), {
        Nombre: nombre,
        Cantidad: parseInt(cantidad, 10), // Convertir a número
      });

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