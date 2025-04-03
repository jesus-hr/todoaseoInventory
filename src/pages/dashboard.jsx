import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signOut, onAuthStateChanged } from "../firebaseConfig";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
/*import HistorialMovimientos from "../components/HistorialMovimientos";*/
import HistorialModal from "../components/HistorialModal"; // Importamos el nuevo componente
import "../styles/dashboard.css";

const Dashboard = () => {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const navigate = useNavigate();  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Encabezado */}
      <header className="dashboard-header">
        <h1>Inventario de Productos</h1>
        <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      {/* Contenedor principal */}
      <main className="dashboard-main">
        {/* Formulario para agregar productos */}
        <ProductForm />

        {/* Lista de productos */}
        <ProductList />

        {/* 🔹 Botón para abrir el historial */}
        <button 
          className="btn-historial" 
          onClick={() => setMostrarHistorial(true)}
        >
          📊 Historial de Movimientos
        </button>
        
        {/* Modal del historial */}
        {mostrarHistorial && <HistorialModal onClose={() => setMostrarHistorial(false)} />}
        {/*<HistorialMovimientos />*/}
      </main>
    </div>
  );
};

export default Dashboard;