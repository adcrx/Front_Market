import { createContext, useState, useEffect } from "react";

// Crear el contexto para la autenticación
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Recuperar los datos de usuario desde el localStorage cuando el componente se monte
    const userData = JSON.parse(localStorage.getItem("usuario"));
    
    if (userData) setUsuario(userData); // Si existe usuario, lo configuramos
  }, []);

  // Función para iniciar sesión y guardar los datos del usuario
  const login = (datosUsuario) => {
    setUsuario(datosUsuario); // Guardamos los datos del usuario en el estado
    localStorage.setItem("usuario", JSON.stringify(datosUsuario)); // Guardamos el usuario en localStorage
  };

  // Función para cerrar sesión y eliminar los datos del usuario
  const logout = () => {
    setUsuario(null); // Limpiar los datos del usuario en el estado
    localStorage.removeItem("usuario"); // Eliminar el usuario del localStorage
  };

  // Proporcionamos el contexto a los componentes hijos
  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
