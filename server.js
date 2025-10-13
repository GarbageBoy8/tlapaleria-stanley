
// ------ servidor node.js ------

import express from "express";
import fs from "fs";
import XLSX from "xlsx";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

const FILE_PATH = "./registros_login.xlsx";

// Asegura que el archivo Excel exista
function ensureWorkbook() {
  if (!fs.existsSync(FILE_PATH)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Usuario", "Contraseña", "Fecha"]]);
    XLSX.utils.book_append_sheet(wb, ws, "Login");
    XLSX.writeFile(wb, FILE_PATH);
  }
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  ensureWorkbook();

  const workbook = XLSX.readFile(FILE_PATH);
  const sheet = workbook.Sheets["Login"];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Agregar una nueva fila con usuario, contraseña y fecha
  data.push([username, password, new Date().toLocaleString()]);

  workbook.Sheets["Login"] = XLSX.utils.aoa_to_sheet(data);
  XLSX.writeFile(workbook, FILE_PATH);

  res.json({ message: "Inicio de sesión registrado en Excel ✅" });
});

app.listen(3000, () =>
  console.log("Servidor corriendo en http://localhost:3000")
);
