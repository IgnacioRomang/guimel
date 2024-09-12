// databases/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  Timestamp,
  collection,
  query,
  where,
  deleteDoc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { UserDatabaseInterface, User, UserToSave } from "../interface/user";
import { v4 as uuidv4 } from "uuid";
import Hash from "../utils/hash";
import logger from "../utils/logger";
import { Database } from ".";
import { Session } from "../interface/session";


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
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
        let user = new User(data.name, data.password, data.ID)
        return { user: user, message: FirebaseDatabase.code.SUCCESS };
      } else {
        return { user: null, message: FirebaseDatabase.code.NOT_FOUND };
      }
    } catch (error) {
      logger.error("Error getting user:", error);
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

  // START Metodos de SessionDatabaseInterface
  public async saveSession(sessionToSave: Session): Promise<{ session: Session | null, message: string }> {
    try {
      const sessionRef = doc(this.db, this.Collection.SESSION, sessionToSave.token);
      await setDoc(sessionRef, sessionToSave.map());
      return { session: sessionToSave, message: FirebaseDatabase.code.SUCCESS };
    } catch (error) {
      logger.error("Error saving a session:", error)
      return { session: null, message: FirebaseDatabase.code.FAILED };;
    }
  }

  public async getSession(token: string): Promise<{ session: Session | null, message: string }> {
    try {
      const sessionRef = doc(this.db, this.Collection.SESSION, token);
      const sessionSnapshot = await getDoc(sessionRef);
      if (sessionSnapshot.exists()) {
        let session = sessionSnapshot.data() as Session;
        return { session: session, message: FirebaseDatabase.code.SUCCESS };
      } else {
        return { session: null, message: FirebaseDatabase.code.NOT_FOUND };
      }
    } catch (error) {
      logger.error("Error getting a session: ", error);
      return { session: null, message: FirebaseDatabase.code.FAILED }
    }
  }

  public async deleteSession(token: string): Promise<{ message: string }> {
    try {
      const sessionRef = doc(this.db, this.Collection.SESSION, token);
      await deleteDoc(sessionRef);
      return { message: FirebaseDatabase.code.SUCCESS }
    } catch (error) {
      logger.error("Error deleting a session: ", error);
      return { message: FirebaseDatabase.code.FAILED }
    }
  }

  public async updateSession(token: string, data: Record<string, any>): Promise<{ message: string }> {
    try {
      const sessionRef = doc(this.db, this.Collection.SESSION, token);
      await updateDoc(sessionRef, data);
      return { message: FirebaseDatabase.code.SUCCESS }
    } catch (error) {
      logger.error("Error updating a session: ", error);
      return { message: FirebaseDatabase.code.FAILED }
    }
  }
  // END Metodos de SessionDatabaseInterface
}
