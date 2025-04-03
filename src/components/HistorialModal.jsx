import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/historialmodal.css";

const HistorialModal = ({ onClose }) => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "Historial"), orderBy("Timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHistorial(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>📊 Historial de Movimientos</h2>
        <table>
          <thead>
            <tr>
              <th>Acción</th>
              <th>Producto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {historial.map(({ id, Accion, Producto, Timestamp }) => (
              <tr key={id}>
                <td>{Accion}</td>
                <td>{Producto.Nombre}</td>
                <td>{Timestamp?.toDate().toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialModal;