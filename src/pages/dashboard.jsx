import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signOut, onAuthStateChanged } from "../../firebaseConfig";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import "../styles/dashboard.css";

const Dashboard = () => {
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
      </main>
    </div>
  );
};

export default Dashboard;