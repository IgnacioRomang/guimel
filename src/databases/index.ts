import { FirebaseDatabase } from "./firebase";

type Database = FirebaseDatabase | null;
const databaseType = process.env.DB_TYPE || "firebase"; // Opción por defecto

let db: Database = null;

switch (databaseType) {
  case "firebase":
    db = FirebaseDatabase.getInstance();
    break;
  case "sql":
    //db = new SQLDatabase(); // Asegúrate de tener la implementación SQL
    break;
  case "mongodb":
    //db = new MongoDBDatabase(); // Asegúrate de tener la implementación MongoDB
    break;
  default:
    throw new Error(`Unsupported database type: ${databaseType}`);
}

export default db;
