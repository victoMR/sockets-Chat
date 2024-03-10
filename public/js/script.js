const socket = io();

socket.on("usuariosEnLinea", (usuariosEnLinea) => {
  const estadoEnLineaElement = document.getElementById("estadoEnLinea");
  estadoEnLineaElement.textContent =
    usuariosEnLinea > 0 ? `Online (${usuariosEnLinea})✅` : "Offline❌";
});

socket.emit("response", "Hola desde el cliente");

var enviarData = document.getElementById("enviarData");
enviarDatos.addEventListener("submit", (e) => {
  e.preventDefault();
  var mensaje = document.getElementById("mensaje").value;
  var datos = document.getElementById("datos");
  socket.emit("mensaje", mensaje);
  socket.on("respuesta", (respuesta) => {
    datos.innerHTML = respuesta;
  });
  document.getElementById("mensaje").value = "";
  //   volvere a ponerse en mensaje
  document.getElementById("mensaje").focus();
});
