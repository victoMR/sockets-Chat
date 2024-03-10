let usuariosEnLinea = 0;
let nombreUsuario = "";
let diaCita = "";

function socket(io) {
  io.on("connection", (socket) => {
    usuariosEnLinea++;

    // Envía el número actualizado de usuarios en línea a todos los clientes
    io.emit("usuariosEnLinea", usuariosEnLinea);
    console.log("Usuario conectado");

    socket.on("disconnect", () => {
      usuariosEnLinea--;

      // Envía el número actualizado de usuarios en línea a todos los clientes
      io.emit("usuariosEnLinea", usuariosEnLinea);
      console.log("Usuario desconectado");
    });

    socket.on("mensaje", async (mensaje) => {
      var respuesta;
      const mensajeConvertido = mensaje.toLowerCase();
      const respuestaConvertida = respuesta.toLowerCase();
      switch (mensajeConvertido) {
        case "hola":
          respuesta =
            " <span style='color: white;'>Hola, ¿Quieres agendar una cita? si / no. </span>";
          break;
        case "si":
          if (!nombreUsuario) {
            respuesta =
              "<span style='color: white;'>Por favor, dime tu nombre.</span>";
          } else {
            respuesta = `<span style='color: white;'>Muy bien ${nombreUsuario}, ¿qué día te gustaría agendar la cita: lunes, martes, miercoles, jueves, viernes?</span>`;
          }
          break;
        case "no":
          respuesta =
            "<span style='color: white;'>¿Hay algo más en lo que pueda ayudarte?</span>";
          nombreUsuario = ""; // Limpiar el nombre de usuario al finalizar la conversación
          diaCita = ""; // Limpiar el día de la cita al finalizar la conversación
          break;
        case "lunes":
        case "martes":
        case "miercoles":
        case "jueves":
        case "viernes":
          if (!nombreUsuario) {
            respuesta = " <span style='color: white;'>Por favor, primero dime tu nombre.</span>"
          } else {
            diaCita = mensaje;
            respuesta = `<span style='color: white;'>¿A qué hora te gustaría agendar la cita el ${diaCita}? Por ejemplo, 9, 10, 11, 12.</span>`;
          }
          break;
        case "9":
        case "10":
        case "11":
        case "12":
          if (!diaCita) {
            respuesta = " <span style='color: white;'>Por favor, primero dime el día en que te gustaría agendar la cita.</span>"
          } else {
            respuesta = `<span style='color: white;'>Perfecto, ¿quieres agendar tu cita para el día ${diaCita} a las ${mensaje}?  aceptar  / negar</span>`;
          }
          break;
        case "aceptar":
          if (!nombreUsuario || !diaCita) {
            respuesta = "<span style='color: white;'>Lo siento, parece que hay un problema. ¿Puedes repetirlo?</span>";
          } else {
            respuesta = `<span style='color: white;'>La cita para el día ${diaCita} a las ${mensaje} ha sido agendada. ¿En qué más puedo ayudarte? Puedo ayudarte con las siguientes opciones:\n- Agendar una cita\n- Cancelar una cita ("cancelar cita")\n- Obtener información sobre la empresa ("informacion") \n- Obtener la temperatura  ("temp")</span>`;
            // Puedes realizar acciones adicionales aquí, como almacenar la cita en una base de datos.
            nombreUsuario = ""; // Limpiar el nombre de usuario después de agendar la cita
            diaCita = ""; // Limpiar el día de la cita después de agendar la cita
          }
          break;
        case "negar":
          respuesta = "<span style='color: white;'>Entendido, la cita no ha sido agendada. ¿Hay algo más en lo que pueda ayudarte?</span>";
          nombreUsuario = ""; // Limpiar el nombre de usuario después de negar la cita
          diaCita = ""; // Limpiar el día de la cita después de negar la cita
          break;
        case "cancelar cita":
          if (!nombreUsuario || !diaCita) {
            respuesta =
              " <span style='color: white;'>Lo siento, no tienes una cita agendada. ¿Hay algo más en lo que pueda ayudarte?</span>";
          } else {
            respuesta = `<span style='color: white;'>¿Quieres cancelar tu cita para el día ${diaCita} a las ${mensaje}? si / no</span>`;
          }
          break;
        case "si":
          respuesta = `<span style='color: white;'>La cita para el día ${diaCita} a las ${mensaje} ha sido cancelada. ¿En qué más puedo ayudarte?</span>`;
          // Puedes agregar lógica adicional aquí, como eliminar la cita de la base de datos.
          nombreUsuario = ""; // Limpiar el nombre de usuario después de cancelar la cita
          diaCita = ""; // Limpiar el día de la cita después de cancelar la cita
          break;
        case "no":
          respuesta =
            "<span style='color: white;'>¿Hay algo más en lo que pueda ayudarte?</span>";
          break;
        case "informacion":
          respuesta = "<span style='color: white;'>Nuestra empresa es una empresa de ejemplo que brinda servicios de ejemplo. ¿En qué más puedo ayudarte?</span>";
          break;
        case "opciones":
          respuesta =
            "<span style='color: white;'>Puedo ayudarte con las siguientes opciones:\n- Agendar una cita\n- Cancelar una cita\n- Obtener información sobre la empresa\n- \n- Obtener la temperatura  ('temp')</span> </span>";
          break;
        case "salir":
          respuesta = "<span style='color: white;'>¡Hasta luego! Si necesitas algo más, estaré aquí. 😊 Adios</span>";
          nombreUsuario = ""; // Limpiar el nombre de usuario al finalizar la conversación
          diaCita = ""; // Limpiar el día de la cita al finalizar la conversación
        case "adios":
          respuesta = "<span style='color: white;'>¡Hasta luego! Si necesitas algo más, estaré aquí. 😊 Adios</span>"
          nombreUsuario = ""; // Limpiar el nombre de usuario al finalizar la conversación
          diaCita = ""; // Limpiar el día de la cita al finalizar la conversación
        case "temp": // tempeture usando una api de mexico
          const temp = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Mexico&appid=a586e35a1621378bd6b409b8f1e3093d');
          const data = await temp.json();
          // convert a F to C
          const convert = (data.main.temp - 273.15).toFixed(2);
          respuesta = `<span style='color: white;'>La temperatura en México es de ${convert}°C</span>`;
          break;
        case "Data":
          // datos de el ordenador osea el cliente
          respuesta = `<span style='color: white;'>${socket.handshake.address}</span>`;
          break; 
        default:
          if (!nombreUsuario) {
            nombreUsuario = mensaje;
            respuesta = `<span style='color: white;'>Dime ${nombreUsuario}, ¿qué día te gustaría agendar la cita: lunes, martes, miercoles, jueves, viernes?</span>`;
          } else {
            respuesta = `<span style='color: white;'>Lo siento, no entendí. ¿Puedes repetirlo?</span>`;
          }
          break;
      }
      io.emit("respuesta", respuesta);
    });
  });
}

module.exports = socket;
