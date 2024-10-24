/* "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { user, chat, User } from "./schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.id, id));
    }

    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}
 */


import fs from "fs";

import { genSaltSync, hashSync } from "bcrypt-ts";

const DB_PATH = "./db/db.json";

function readDB() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function writeDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Obtener usuario por email
export async function getUser(email: string) {
  try {
    const db = readDB();
    return db.users.filter((user: any) => user.email === email);
  } catch (error) {
    console.error("Failed to get user from JSON database");
    throw error;
  }
}

// Crear usuario
export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    const db = readDB();
    const newUser = { id: crypto.randomUUID(), email, password: hash };
    db.users.push(newUser);
    writeDB(db);
    return newUser;
  } catch (error) {
    console.error("Failed to create user in JSON database");
    throw error;
  }
}

// Guardar chat
export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const db = readDB();
    const chatIndex = db.chats.findIndex((chat: any) => chat.id === id);

    if (chatIndex > -1) {
      db.chats[chatIndex].messages = messages;
    } else {
      db.chats.push({
        id,
        createdAt: new Date(),
        messages,
        userId,
      });
    }
    writeDB(db);
  } catch (error) {
    console.error("Failed to save chat in JSON database");
    throw error;
  }
}

// Eliminar chat por ID
export async function deleteChatById({ id }: { id: string }) {
  try {
    const db = readDB();
    db.chats = db.chats.filter((chat: any) => chat.id !== id);
    writeDB(db);
  } catch (error) {
    console.error("Failed to delete chat by id from JSON database");
    throw error;
  }
}

// Obtener chats por ID de usuario
export async function getChatsByUserId({ id }: { id: string }) {
  try {
    const db = readDB();
    
    // Filtrar chats por userId y ordenar por createdAt (convertido a Date)
    return db.chats
      .filter((chat: any) => chat.userId === id)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime(); // Orden descendente
      });
  } catch (error) {
    console.error("Failed to get chats by user from JSON database");
    throw error;
  }
}

// Obtener chat por ID
export async function getChatById({ id }: { id: string }) {
  try {
    const db = readDB();
    return db.chats.find((chat: any) => chat.id === id);
  } catch (error) {
    console.error("Failed to get chat by id from JSON database");
    throw error;
  }
}
