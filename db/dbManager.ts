/* import fs from 'fs';
const DB_PATH = './data/db.json';

function readDB() {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getMessages() {
  const db = readDB();
  return db.messages;
}

function addMessage(newMessage: any) {
  const db = readDB();
  db.messages.push(newMessage);
  writeDB(db);
} */