import winston from "winston";
import path from "path";

// Definir niveles personalizados de logs (error, warn, info, verbose, debug, silly)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Colores para cada nivel de logueo (para la consola)
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue"
};

// Asignar colores a winston
winston.addColors(colors);

// Formato del log (tiempo, nivel, mensaje)
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
);

// Transportes para guardar los logs en archivos
const transports = [
  new winston.transports.Console(), // Mostrar logs en la consola
  new winston.transports.File({ filename: path.join(__dirname, "../logs/error.log"), level: "error" }), // Solo errores
  new winston.transports.File({ filename: path.join(__dirname, "../logs/all.log") }) // Todos los logs
];

// Crear el logger con la configuración
const logger = winston.createLogger({
  level: "debug", // Nivel mínimo que será registrado (error hasta debug)
  levels, // Niveles personalizados
  format, // Formato de los logs
  transports // Transportes configurados
});

export default logger;
