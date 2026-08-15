import prisma from "./config/prisma.js";

export async function test() {
  try {
    await prisma.$connect();
    console.log("Connecté à la base de données PostgreSQL  ✅");
  } catch (err) {
    console.error("❌ Erreur de connexion à la base de données :", err);
  } 
}
// Supprime l'appel direct 'test();' ici si tu l'appelles déjà dans startServer()