import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { registrarMovimiento } from "../movimientos"; // Importamos la función
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
                  <button onClick={() => handleEdit(product)}>✏️ Editar</button>
                  <button onClick={() => handleDelete(product.id, product.Nombre)}>❌ Eliminar</button>
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