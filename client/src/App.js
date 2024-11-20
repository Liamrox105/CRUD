import './App.css';
import { useState, useEffect } from "react";
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

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

  const validateFields = () => {
    if (!nombre || !edad || !pais || !cargo || !anios) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor complete todos los campos antes de continuar.",
      });
      return false;
    }
    return true;
  };

  const add = () => {
    if (!validateFields()) return;
    Axios.post("http://localhost:3001/create", {
      nombre,
      edad,
      pais,
      cargo,
      anios,
    })
      .then(() => {
        getEmpleados();
        resetForm();
        Swal.fire({
          title: "<strong>'Registro Exitoso'</strong>",
          html: `<i>El empleado <strong>${nombre}</strong> fue registrado con éxito!</i>`,
          icon: 'success',
          timer: 3000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al registrar el empleado!",
          footer: error.message === "Network Error" ? "Intente más tarde" : error.message,
        });
      });
  };

  const update = () => {
    if (!validateFields()) return;

    Axios.put("http://localhost:3001/update", {
      id,
      nombre,
      edad,
      pais,
      cargo,
      anios,
    })
      .then(() => {
        getEmpleados();
        setEditar(false);
        resetForm();
        Swal.fire({
          title: "<strong>'Actualización Exitosa'</strong>",
          html: `<i>El empleado <strong>${nombre}</strong> fue actualizado con éxito!</i>`,
          icon: 'success',
          timer: 3000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al actualizar el empleado!",
          footer: error.message === "Network Error" ? "Intente más tarde" : error.message,
        });
      });
  };

  const deleteEmple = (val) => {
    Swal.fire({
      title: "Confirmar eliminación",
      html: `<i>Eliminar: <strong>${val.nombre}</strong></i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`)
          .then(() => {
            getEmpleados();
            Swal.fire({
              icon: "success",
              title: "Eliminado",
              text: `${val.nombre} fue eliminado con éxito`,
              showConfirmButton: false,
              timer: 2000,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error al eliminar el empleado!",
              footer: error.message === "Network Error" ? "Intente más tarde" : error.message,
            });
          });
      }
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
    resetForm();
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header"><strong>GESTION DE EMPLEADOS</strong></div>
        <div className="card-body">
          <div className="datos">
            <div className="input-group mb-3">
              <span className="input-group-text">Nombre:</span>
              <input
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                className="form-control"
                value={nombre}
                placeholder="Ingrese un nombre"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">Edad:</span>
              <input
                onChange={(e) => setEdad(Number(e.target.value))}
                type="number"
                className="form-control"
                value={edad}
                placeholder="Ingrese edad"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">País:</span>
              <input
                onChange={(e) => setPais(e.target.value)}
                type="text"
                className="form-control"
                value={pais}
                placeholder="Ingrese el país"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">Cargo:</span>
              <input
                onChange={(e) => setCargo(e.target.value)}
                type="text"
                className="form-control"
                value={cargo}
                placeholder="Ingrese el cargo"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">Antigüedad:</span>
              <input
                onChange={(e) => setAnios(Number(e.target.value))}
                type="number"
                className="form-control"
                value={anios}
                placeholder="Ingrese la antigüedad"
              />
            </div>
          </div>
        </div>
        <div className="card-footer">
          {editar ? (
            <>
              <button className="btn btn-warning m-2" onClick={update}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={cancelEdit}>
                Cancelar
              </button>
            </>
          ) : (
            <button className="btn btn-success" onClick={add}>
              Registrar
            </button>
          )}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>País</th>
            <th>Cargo</th>
            <th>Antigüedad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosList.map((val) => (
            <tr key={val.id}>
              <td>{val.id}</td>
              <td>{val.nombre}</td>
              <td>{val.edad}</td>
              <td>{val.pais}</td>
              <td>{val.cargo}</td>
              <td>{val.anios}</td>
              <td>
                <button className="btn btn-info m-1" onClick={() => editarEmpleado(val)}>
                  Editar
                </button>
                <button className="btn btn-danger m-1" onClick={() => deleteEmple(val)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
