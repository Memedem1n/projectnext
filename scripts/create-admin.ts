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
            password: await hash("admin123", 10),
            name: "Admin",
            phone: "5551112233",
            role: "ADMIN",
            status: "ACTIVE",
            emailVerified: new Date(),
        }
    });

    console.log("✅ Admin account created!");
    console.log("Email: admin@sahibinden.com");
    console.log("Password: admin123");
}

createAdminAccount()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
