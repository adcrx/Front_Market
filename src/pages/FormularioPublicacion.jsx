import axios from "axios";
import { useState } from "react";
import "../assets/css/FormularioPublicacion.css";

function FormularioPublicacion() {
  const [imagenes, setImagenes] = useState([]);
  const [urlImagen, setUrlImagen] = useState("");

  const [formData, setFormData] = useState({
    titulo: "",
    precio: "",
    categoria: "",
    descripcion: "",
    stock: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUrlChange = (e) => {
    setUrlImagen(e.target.value);
  };

  const agregarImagen = () => {
    if (!urlImagen.trim()) return;
    if (imagenes.length >= 4) {
      alert("Solo puedes añadir hasta 4 imágenes");
      return;
    }

    setImagenes((prev) => [...prev, urlImagen]); // ✅ forma segura
    setUrlImagen("");
  };

  const eliminarImagen = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const mapCategoria = {
      hombre: 1,
      mujer: 2,
      accesorios: 3,
      tecnologia: 4,
    };

    console.log("🟨 Imagenes actuales:", imagenes);

    const productoFinal = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      categoria_id: mapCategoria[formData.categoria],
      stock: parseInt(formData.stock),
      imagen: imagenes.length > 0 ? imagenes[0] : null, // ✅ esto es lo que se guarda
      vendedor_id: parseInt(userId),
    };

    console.log("✅ Producto enviado al backend:", productoFinal);

    axios
      .post("https://backend-market-8jdy.onrender.com/productos", productoFinal, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => alert("¡Publicación creada!"))
      .catch((err) => {
        console.error(err);
        alert("Error al publicar.");
      });
  };

  return (
    <div className="formulario-publicacion-container">
      <div className="imagenes-publicacion">
        <div className="imagen-y-miniaturas">
          <div className="zona-principal">
            {imagenes[0] ? (
              <>
                <img src={imagenes[0]} alt="Principal" />
                <button
                  className="boton-eliminar"
                  onClick={() => eliminarImagen(0)}
                >
                  ×
                </button>
              </>
            ) : (
              <div className="texto-overlay">AÑADIR FOTOS</div>
            )}
          </div>

          <div className="miniaturas-laterales">
            {imagenes.slice(1).map((src, index) => (
              <div key={index} className="miniatura-overlay">
                <img src={src} alt={`Miniatura ${index + 1}`} />
                <div className="numero-overlay">+{index + 1}</div>
                <button
                  className="boton-eliminar"
                  onClick={() => eliminarImagen(index + 1)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="titulo-imagenes">Añadir imágenes mediante URL</p>
        <div className="url-input-container">
          <input
            type="url"
            value={urlImagen}
            onChange={handleUrlChange}
            placeholder="Pega aquí la URL de la imagen"
            className="url-input"
          />
          <button
            onClick={agregarImagen}
            type="button"
            className="agregar-url-btn"
          >
            Añadir
          </button>
        </div>
        <p className="texto-info">
          Añade hasta 4 imágenes usando URLs de internet
        </p>
      </div>

      <div className="formulario-container">
        <h2>FORMULARIO DE PUBLICACIÓN</h2>
        <form onSubmit={handleSubmit}>
          <div className="grupo-input">
            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
            />
          </div>

          <div className="grupo-input">
            <label htmlFor="precio">Precio</label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
            />
          </div>

          <div className="grupo-input">
            <label htmlFor="stock">Cantidad de Productos</label>
            <select
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            >
              {[...Array(55).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="grupo-input">
            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
            >
              <option value="">Selecciona categoría</option>
              <option value="hombre">Ropa de Hombre</option>
              <option value="mujer">Ropa de Mujer</option>
              <option value="accesorios">Accesorios</option>
              <option value="tecnologia">Tecnología</option>
            </select>
          </div>

          <div className="grupo-input">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit">PUBLICAR</button>
        </form>
      </div>
    </div>
  );
}

export default FormularioPublicacion;