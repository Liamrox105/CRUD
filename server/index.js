const express = require("express");
const app = express();
const mysql = require ("mysql");
const cors = require ("cors");

app.use(cors());
app.use(express.json());


const db =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database:'empleados_crud'
})

app.post("/create", (req,res) =>{
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo; 
    const anios = req.body.anios; 

    db.query('INSERT INTO empleados(nombre,edad,pais,cargo,anios) VALUES(?, ?, ?, ?, ?)', [nombre,edad,pais,cargo,anios],
        (err, results) => {
            if(err){
                console.log(err)
                }else{
                    res.send("empleado registrado con exito!!");
                }
        }
    )
});

app.get("/empleados", (req,res) =>{
    db.query('SELECT * FROM empleados',
        (err, result) => {
            if(err){
                console.log(err)
                }else{
                    res.send(result);
                }
        }
    )
});

app.put('/update', (req, res) => {
    const { id, nombre, edad, pais, cargo, anios } = req.body;
    const query = `UPDATE empleados SET nombre = ?, edad = ?, pais = ?, cargo = ?, anios = ? WHERE id = ?`;
    
    db.query(query, [nombre, edad, pais, cargo, anios, id], (err, result) => {
      if (err) {
        return res.status(500).send('Error updating employee');
      }
      res.status(200).send('Employee updated');
    });
  });
  
  app.delete('/delete', (req, res) => {
    const { id } = req.body; 

    const query = 'DELETE FROM empleados WHERE id = ?';

    db.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error eliminando empleado');
      }
      res.status(200).send('Empleado eliminado');
    });
});


app.listen(3001, ()=>{
    console.log("Server is running on port 3001");
})
