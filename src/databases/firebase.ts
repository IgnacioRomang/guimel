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
} from "firebase/firestore";
import { UserDatabaseInterface, User, UserToSave } from "../interface/user";
import { v4 as uuidv4 } from "uuid";
import Hash from "../utils/hash";
import logger from "../logs/logger";
import { Database } from ".";
import { SessionToSave, Session } from "../interface/session";

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
    userToSave: UserToSave
  ): Promise<{ user: User | null; message: string }> {
    try {
      const usersQuery = query(
        collection(this.db, this.Collection.USERS),
        where("email", "==", userToSave.email)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        //EMAIL REPETIDO
        return {
          user: null,
          message: FirebaseDatabase.code.INVALID_INPUT,
        };
      }
      const userId = uuidv4();
      const userRef = doc(this.db, this.Collection.USERS, userId);
      let user: User = {
        ID: userId,
        name: userToSave.name,
        email: userToSave.email,
        password: userToSave.password,
      };
      await setDoc(userRef, user);
      return { user, message: FirebaseDatabase.code.SUCCESS };
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
        let user = userSnapshot.data() as User;
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
  public async saveSession(sessionToSave: SessionToSave): Promise<Session> {
    try {
      let today = new Date();
      const ttl = process.env.FIREBASE_TTL
        ? Number(process.env.FIREBASE_TTL)
        : 3600; // 3600 son 1h

      let session: Session = {
        userID: sessionToSave.userID,
        token: sessionToSave.token,
        created_at: Timestamp.fromDate(today),
        updated_at: null,
        expires_at: Timestamp.fromDate(new Date(today.getTime() + ttl * 1000)),
      };
      const sessionRef = doc(this.db, this.Collection.SESSION, session.token); // Usa el userID como ID del documento
      await setDoc(sessionRef, session);
      return session;
    } catch (error) {
      return null;
    }
  }
  public async getSession(id: string): Promise<User | void> {
    return;
  }
  public async deleteSession(id: string): Promise<void> {}
  public async updateSession(id: string): Promise<void> {}
  // END Metodos de SessionDatabaseInterface
}
