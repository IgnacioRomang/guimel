// databases/firebase.ts
import { initializeApp } from "firebase/app";
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Database } from ".";
import { User } from "../interface/user";
import logger from "../utils/logger";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Clase que representa la base de datos Firebase
export class FirebaseDatabase extends Database {
  private static instance: FirebaseDatabase;
  private db: Firestore;

  // por si quiero cambiar el nombre de las tablas
  private Collection = {
    USERS: "users",
    SESSION: "sessions",
  };

  private constructor() {
    super();
    try {
      const app = initializeApp(firebaseConfig);
      this.db = getFirestore(app);
    } catch (error) {
      logger.error("Error initializing Firebase:", error);
      throw new Error(FirebaseDatabase.code.DB_ERROR);
    }
  }

  public static getInstance(): FirebaseDatabase {
    if (!FirebaseDatabase.instance) {
      FirebaseDatabase.instance = new FirebaseDatabase();
    }
    return FirebaseDatabase.instance;
  }

  // START Metodos de UserDatabaseInterface
  public async saveUser(
    userToSave: User
  ): Promise<{ user: User | null; message: string }> {
    try {
      const usersQuery = query(
        collection(this.db, this.Collection.USERS),
        where("name", "==", userToSave.name)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        return {
          user: null,
          message: FirebaseDatabase.code.INVALID_INPUT,
        };
      }
      userToSave.makeUUID();
      const userRef = doc(this.db, this.Collection.USERS, userToSave.ID);
      await setDoc(userRef, userToSave.map());
      return { user: userToSave, message: FirebaseDatabase.code.SUCCESS };
    } catch (error) {
      logger.error("Error saving user:", error);
      return { user: null, message: FirebaseDatabase.code.FAILED };
    }
  }

  public async getUser(
    id: string
  ): Promise<{ user: User | null; message: string }> {
    try {
      const userRef = doc(this.db, this.Collection.USERS, id);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        let data = userSnapshot.data();
        let user = await User.create(
          data.name,
          data.password,
          data.ID,
          data.created_at,
          data.updated_at
        );
        return { user: user, message: FirebaseDatabase.code.SUCCESS };
      } else {
        return { user: null, message: FirebaseDatabase.code.NOT_FOUND };
      }
    } catch (error) {
      logger.error("Error getting user with id:", error);
      return { user: null, message: FirebaseDatabase.code.FAILED };
    }
  }

  public async getUserByName(
    username: string
  ): Promise<{ user: User | null; message: string }> {
    try {
      const usersQuery = query(
        collection(this.db, this.Collection.USERS),
        where("name", "==", username)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        let user = await User.create(
          userData.name,
          userData.password,
          userData.ID,
          userData.created_at,
          userData.updated_at
        );
        return { user: user, message: FirebaseDatabase.code.SUCCESS };
      } else {
        return { user: null, message: FirebaseDatabase.code.NOT_FOUND };
      }
    } catch (error) {
      logger.error("Error getting user with name:", error);
      return { user: null, message: FirebaseDatabase.code.FAILED };
    }
  }

  public async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const userRef = doc(this.db, this.Collection.USERS, id);
      await deleteDoc(userRef);
      return { message: FirebaseDatabase.code.SUCCESS };
    } catch (error) {
      logger.error("Error deleting a user:", error);
      return { message: FirebaseDatabase.code.FAILED };
    }
  }
  // END Metodos de UserDatabaseInterface
}
