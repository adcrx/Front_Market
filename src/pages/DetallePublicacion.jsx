import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CarritoContext } from "../context/CarritoContext";
import "../assets/css/DetallePublicacion.css";

function DetallePublicacion() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const { agregarAlCarrito, carrito } = useContext(CarritoContext);

  // Mapeo de IDs de categoría a nombres
  const mapCategoriaIdToNombre = {
    1: "hombre",
    2: "mujer",
    3: "accesorios",
    4: "tecnologia"
  };

  // Cargar el producto
  useEffect(() => {
    axios.get(`https://backend-market-8jdy.onrender.com/productos/${id}`)
      .then((res) => {
        const productoData = res.data.data || res.data;
        setProducto(productoData);
        
        // Accede SIEMPRE a productoData.imagen
        const imagePath = productoData.imagen;
        if (imagePath) {
          setImagenes([imagePath, imagePath + "?1", imagePath + "?2"]);
        } else {
          console.error("No se encontró imagen");
        }
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);
  
  // Revisar si ya hay productos con este ID en el carrito
  useEffect(() => {
    if (!producto) return;
    const cantidadTotal = carrito
      .filter((item) => item.id === producto.id)
      .reduce((sum, item) => sum + item.cantidad, 0);
    setCantidad(cantidadTotal > 0 ? cantidadTotal : 1);
  }, [producto, carrito]);

  console.log("Producto agregado:", producto);
  const handleAgregar = () => {
    agregarAlCarrito({
      ...producto,
      cantidad,
      vendedor_id: producto.usuario_id || producto.vendedor_id // <- aseguramos que venga este campo
    });
  };

  if (!producto) return <p>Cargando producto...</p>;

  // Acceder a las propiedades del producto con fallbacks para diferentes nombres de propiedades
  const titulo = producto.title || producto.titulo || "Sin título";
  const precio = producto.price || producto.precio || 0;
  const categoria = producto.category || mapCategoriaIdToNombre[producto.categoria_id] || "Sin categoría";
  const descripcion = producto.description || producto.descripcion || "Sin descripción";
  const stock = producto.stock || 0;

  return (
    <div className="detalle-container">
      <div className="detalle-imagenes">
        <div className="imagen-principal">
          {imagenes.length > 0 ? (
            <img src={imagenes[imagenSeleccionada]} alt={titulo} />
          ) : (
            <div className="no-imagen">Imagen no disponible</div>
          )}
        </div>
        <div className="miniaturas">
          {imagenes.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`mini ${index}`}
              onClick={() => setImagenSeleccionada(index)}
              className={index === imagenSeleccionada ? "miniatura activa" : "miniatura"}
            />
          ))}
        </div>
      </div>

      <div className="detalle-info">
        <h2 className="detalle-titulo">{titulo}</h2>
        <p className="detalle-precio">${Number(precio).toLocaleString('es-CL')}</p>

        <div className="detalle-descripcion">
          <p><strong>Tipo de Producto:</strong> {categoria}</p>
          <p><strong>Descripción:</strong> {descripcion}</p>        
          <p><strong>Stock:</strong> {stock}</p>       
        </div>

    


        <div className="detalle-cantidad">
          <p><strong>Cantidad:</strong></p>
          <div className="cantidad-control">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
            <span>{cantidad}</span>
            <button onClick={() => setCantidad(cantidad + 1)}>+</button>
          </div>
        </div>

        <button className="btn-agregar" onClick={handleAgregar}>AGREGAR AL CARRITO</button>
      </div>
    </div>
  );
}

export default DetallePublicacion;