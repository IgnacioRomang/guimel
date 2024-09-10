// databases/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { UserDatabaseInterface, User } from "../interface/user";
import { v4 as uuidv4 } from "uuid";
import Hash from "../utils/hash";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Clase que representa la base de datos Firebase
export class FirebaseDatabase implements UserDatabaseInterface {
  private static instance: FirebaseDatabase;
  private db: Firestore;

  private constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  public static getInstance(): FirebaseDatabase {
    if (!FirebaseDatabase.instance) {
      FirebaseDatabase.instance = new FirebaseDatabase();
    }
    return FirebaseDatabase.instance;
  }

  // Metodos de UserDatabaseInterface
  public async saveUser(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    const userId = uuidv4(); // Genera un UUID único para el usuario
    const userRef = doc(this.db, "users", userId);
    await setDoc(userRef, { userId, name, email, password });
    return {
      ID: userId,
      name,
      email,
      password,
    } as User;
  }

  public async getUser(id: string): Promise<User | null> {
    const userRef = doc(this.db, "users", id);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return {
        ID: id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
      } as User;
    }
    return null;
  }

  public async deleteUser(id: string): Promise<void> {
    const userRef = doc(this.db, "users", id);
    await setDoc(userRef, {}, { merge: true });
  }
  // Métodos para interactuar con la base de datos pueden ir aquí
}
