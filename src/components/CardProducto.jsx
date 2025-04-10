// src/components/CardProducto.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import "../assets/css/CardProducto.css";

function CardProducto({ producto }) {
  const { agregarAlCarrito, disminuirCantidad, carrito } =
    useContext(CarritoContext);
  const navigate = useNavigate();

  if (!producto?.id) return null;

  const { id, titulo, precio, imagen, rating } = producto;
  const cantidad = carrito.find((p) => p.id === id)?.cantidad || 0;

  // Si rating no está definido, asumimos un valor predeterminado de 0
  const estrellas = rating || 0;

  // Función para renderizar las estrellas
  const renderEstrellas = (cantidad) => {
    const estrellas = [];

    // Crear 5 estrellas (llenas o vacías según el rating)
    for (let i = 1; i <= 5; i++) {
      if (i <= cantidad) {
        // Estrella llena
        estrellas.push(
          <span key={i} className="estrella llena">
            ★
          </span>
        );
      } else {
        // Estrella vacía
        estrellas.push(
          <span key={i} className="estrella vacia">
            ☆
          </span>
        );
      }
    }

    return estrellas;
  };

  return (
    <div className="producto">
      <div className="imagen-container">
      <img src={imagen || "https://via.placeholder.com/150"} alt={titulo} />
      </div>

      <div className="rating-container">{renderEstrellas(estrellas)}</div>

      <h4>{titulo}</h4>

      <div className="acciones">
        <p>${Number(precio).toLocaleString("es-CL")}</p>
        <button
          className="detalle-button"
          onClick={() => navigate(`/publicacion/${id}`)}
        >
          Ver detalle
        </button>
        <div className="control-cantidad">
          <button
            onClick={() => disminuirCantidad(id)}
            disabled={cantidad === 0}
          >
            Quitar
          </button>
          <span>{cantidad}</span>
          <button
            onClick={() =>
              agregarAlCarrito({
                ...producto,
                vendedor_id: producto.usuario_id || producto.vendedor_id, // <- este campo es clave
              })
            }
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardProducto;