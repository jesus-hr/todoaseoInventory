import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const HistorialMovimientos = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "Historial"), orderBy("Timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHistorial(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
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
  );
};

export default HistorialMovimientos;