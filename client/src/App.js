import './App.css';
import { useState, useEffect } from "react";
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Swal from 'sweetalert2'


function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState("");
  const [id, setId] = useState(null);
  const [editar, setEditar] = useState(false);
  const [empleadosList, setEmpleados] = useState([]);

  useEffect(() => {
    getEmpleados();
  }, []);

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      getEmpleados();
      alert("Empleado Registrado");
      resetForm();
      Swal.fire({
        title: "<strong>'Registro Exitoso'</strong>",
        html: "<i>El empleado <strong> "+nombre+" </strong> fue registrado con exito!</i>",
        icon: 'success',
        timer:3000
      })
    }).catch(err => {
      console.error("Error al registrar empleado", err);
      alert("Hubo un error al registrar el empleado.");
    });
  };

  const deleteEmpleado = () => {
    Axios.post(`http://localhost:3001/delete/${id}`).then(() => {
      getEmpleados();
      resetForm();
      Swal.fire({
        title: "<strong>'Actualización Exitosa'</strong>",
        html: "<i>El empleado <strong> "+nombre+" </strong> fue actualizado con exito!</i>",
        icon: 'success',
        timer:3000
      })
    }).catch(err => {
      console.error("Error al elimanr empleado", err);
      alert("Hubo un error al eliminar el empleado.");
    });
  };

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    })
    .then(() => {
      getEmpleados();
      alert("Empleado Actualizado");
      setEditar(false);
      resetForm();
    })
    .catch(err => {
      console.error("Error al actualizar empleado", err);
      alert("Hubo un error al actualizar el empleado.");
    });
  };
  

  const resetForm = () => {
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAnios("");
    setId(null);
  };

  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnios(val.anios);
    setId(val.id);
  };

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados")
      .then((response) => {
        setEmpleados(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener empleados", error);
        alert("Hubo un error al obtener los empleados.");
      });
  };

  const cancelEdit = () => {
    setEditar(false);
    resetForm(); // Reset form fields when cancelling
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          GESTION DE INVENTARIO
        </div>
        <div className="card-body">
          <div className="datos">
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Nombre: </span>
              <input
                id="nombre"
                onChange={(event) => setNombre(event.target.value)}
                type="text"
                className="form-control"
                value={nombre}
                placeholder="Ingrese un nombre"
                aria-label="Nombre"
                aria-describedby="basic-addon1"
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon2">Edad: </span>
              <input
                id="edad"
                onChange={(event) => setEdad(Number(event.target.value))}
                type="number"
                className="form-control"
                value={edad}
                placeholder="Ingrese edad"
                aria-label="Edad"
                aria-describedby="basic-addon2"
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon3">Pais: </span>
              <input
                id="pais"
                onChange={(event) => setPais(event.target.value)}
                type="text"
                className="form-control"
                value={pais}
                placeholder="Ingrese el pais"
                aria-label="Pais"
                aria-describedby="basic-addon3"
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon4">Cargo: <i className="bi bi-briefcase"></i></span>
              <input
                id="cargo"
                onChange={(event) => setCargo(event.target.value)}
                type="text"
                className="form-control"
                value={cargo}
                placeholder="Ingrese el cargo"
                aria-label="Cargo"
                aria-describedby="basic-addon4"
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon5">Antiguedad: <i className="bi bi-calendar"></i></span>
              <input
                id="anios"
                onChange={(event) => setAnios(Number(event.target.value))}
                type="number"
                className="form-control"
                value={anios}
                placeholder="Ingrese la antiguedad"
                aria-label="Antiguedad"
                aria-describedby="basic-addon5"
              />
            </div>
          </div>
        </div>
        <div className="card-footer text-body-secondary">
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
              <button className="btn btn-info m-2" onClick={cancelEdit}>Cancelar</button>
            </div>
          ) : (
            <button className="btn btn-success" onClick={add}>Registrar</button>
          )}
        </div>
      </div>

      <table className="table table-striped-columns">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">Pais</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosList.map((val) => (
            <tr key={val.id}>
              <th>{val.id}</th>
              <td>{val.nombre}</td>
              <td>{val.edad}</td>
              <td>{val.pais}</td>
              <td>{val.cargo}</td>
              <td>{val.anios}</td>
              <td>
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" onClick={() => editarEmpleado(val)} className="btn btn-info">Editar</button>
                  <button type="button" onClick={() => deleteEmpleado(val)} className="btn btn-danger">Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
