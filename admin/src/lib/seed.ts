import { hash } from "bcryptjs"
import { db } from "./db"

async function main() {
  try {
    // Create admin user
    const hashedPassword = await hash("admin123", 12)
    
    const admin = await db.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    console.log(`Created admin user with id: ${admin.id}`)
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await db.$disconnect()
  }
}

main()
