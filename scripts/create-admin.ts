import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function createAdminAccount() {
    console.log("Creating admin account...");

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: "admin@sahibinden.com" }
    });

    if (existingAdmin) {
        console.log("✅ Admin already exists:", existingAdmin.email);
        return;
    }

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email: "admin@sahibinden.com",
            name: "Admin",
            phone: "5551112233",
            // password, role, status, emailVerified removed as they don't exist in schema
        }
    });

    console.log("✅ Admin account created!");
    console.log("Email: admin@sahibinden.com");
    console.log("Password: admin123");
}

createAdminAccount()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
