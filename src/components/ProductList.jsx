import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { registrarMovimiento } from "../movimientos"; // Importamos la función
import Papa from "papaparse";
import * as XLSX from "xlsx";
import "../styles/productlist.css";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterQuantity, setFilterQuantity] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "Productos"));
      const productList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  // Eliminar producto
  const handleDelete = async (id, nombre) => {
    const confirmDelete = window.confirm(`¿Seguro que deseas eliminar ${nombre}?`);
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "Productos", id));
      setProducts(products.filter(product => product.id !== id));

      // Registrar en historial
      await registrarMovimiento("Eliminar", { id, Nombre: nombre });

      alert("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Hubo un error al eliminar el producto");
    }
  };

  // Activar modo edición
  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setEditedName(product.Nombre);
    setEditedQuantity(product.Cantidad);
  };

  // Guardar cambios
  const handleSave = async (id) => {
    const productRef = doc(db, "Productos", id);
    await updateDoc(productRef, {
      Nombre: editedName,
      Cantidad: editedQuantity,
    });

    setProducts(products.map(prod =>
      prod.id === id ? { ...prod, Nombre: editedName, Cantidad: editedQuantity } : prod
    ));

    // Registrar en historial
    await registrarMovimiento("Editar", { id, Nombre: editedName, Cantidad: editedQuantity });

    setEditingProduct(null);
  };

  // 📤 Exportar a CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(products.map(p => ({
      Nombre: p.Nombre,
      Cantidad: p.Cantidad
    })));

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "productos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📊 Exportar a Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products.map(p => ({
      Nombre: p.Nombre,
      Cantidad: p.Cantidad
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    XLSX.writeFile(workbook, "productos.xlsx");
  };

  // Filtrar productos
  const filteredProducts = products
    .filter((product) =>
      product.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      if (!filterQuantity) return true;
      return product.Cantidad < parseInt(filterQuantity);
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.Nombre.localeCompare(b.Nombre);
      if (sortBy === "quantity") return a.Cantidad - b.Cantidad;
      return 0;
    });

  return (
    <div className="product-list">
      <h2>Lista de Productos</h2>

      {/* Búsqueda y Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setFilterQuantity(e.target.value)}>
          <option value="">Todos</option>
          <option value="5">Menos de 5 unidades</option>
          <option value="10">Menos de 10 unidades</option>
        </select>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Ordenar</option>
          <option value="name">Nombre A-Z</option>
          <option value="quantity">Cantidad</option>
        </select>
      </div>

      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={handleExportCSV}>📤 Exportar CSV</button>
        <button onClick={handleExportExcel}>📊 Exportar Excel</button>
      </div>


      {/* Lista de productos */}
      {filteredProducts.length === 0 ? (
        <p>No hay productos que coincidan...</p>
      ) : (
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id}>
              {editingProduct === product.id ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <input
                    type="number"
                    value={editedQuantity}
                    onChange={(e) => setEditedQuantity(e.target.value)}
                  />
                  <button onClick={() => handleSave(product.id)}>💾 Guardar</button>
                </>
              ) : (
                <>
                  <strong>{product.Nombre}</strong> - {product.Cantidad} unidades
                  <button className="editar" onClick={() => handleEdit(product)}>✏️ Editar</button>
                  <button className="eliminar" onClick={() => handleDelete(product.id, product.Nombre)}>❌ Eliminar</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;