//porfavor tobi no le muevas nada a este archivo

const slides = document.querySelectorAll(".producto-slide");
const sliderContainer = document.querySelector(".slider-container");
let current = 0;
let intervalTime = 3000; // tiempo entre cambios (ms)
let slideWidth = slides[0].offsetWidth + 32; // incluye el gap (2rem ≈ 32px)

function moveSlider() {
  // quitar clase activa actual
  slides[current].classList.remove("active");

  // avanzar al siguiente
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");

  // mover el contenedor
  sliderContainer.style.transform = `translateX(-${current * slideWidth}px)`;
}

// reiniciar cálculo en caso de redimensionar la pantalla
window.addEventListener("resize", () => {
  slideWidth = slides[0].offsetWidth + 32;
});

// ejecutar cada 3 segundos
setInterval(moveSlider, intervalTime);

// aqui inicia tus pendientes tobi

// --- Capturar el envío del formulario ---
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita el envío tradicional

  // Leer los valores del formulario
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    // Enviar al servidor Node.js
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await res.json();
    alert(result.message);
  } catch (error) {
    alert("Error al conectar con el servidor 😢");
    console.error(error);
  }
});

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
  console.log("Servidor corriendo en http://localhost:5000")
);
