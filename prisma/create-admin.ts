/**
 * Crea/actualiza ÚNICAMENTE el usuario admin (sin data demo).
 * Uso:
 *   npm run db:admin
 *
 * Usa ADMIN_EMAIL y ADMIN_PASSWORD de .env
 */
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@luciajeans.com";
  const password = process.env.ADMIN_PASSWORD || "Lucia#2026";

  if (password.length < 6) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 6 caracteres");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, isActive: true },
    create: {
      email,
      password: hash,
      name: "Lucia Admin",
      role: Role.SUPER_ADMIN
    }
  });

  console.log(`✅ Admin listo:`);
  console.log(`   email: ${user.email}`);
  console.log(`   pass : ${password}`);
}

main()
  .catch((e) => {
    console.error("❌ Error creando admin:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
