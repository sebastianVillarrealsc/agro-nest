// src/components/UsuariosList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/usuarios');
        console.log('Usuarios obtenidos:', response.data); // Verificar si los datos llegan correctamente
        setUsuarios(response.data); // Guardar los usuarios obtenidos en el estado
        setLoading(false); // Cambiar el estado de carga
      } catch (error) {
        console.error('Error al obtener los usuarios:', error); // Mostrar detalles del error en consola
        setError('Error al obtener los usuarios'); // Manejar el error
        setLoading(false);
      }
    };

    fetchUsuarios(); // Llamar a la función de fetch cuando el componente se monte
  }, []);

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="card-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
      {usuarios.map((usuario) => (
        <div key={usuario.id} className="card" style={{ border: '1px solid #ccc', margin: '10px', padding: '15px', width: '300px' }}>
          <h3>{usuario.nombre}</h3>
          <p>Apellido: {usuario.apellido}</p>
          <p>Ciudad: {usuario.ciudad}</p>
          <p>Correo: {usuario.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UsuariosList;
