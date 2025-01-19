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

    // Create sample topics
    const worldWar2 = await db.topic.create({
      data: {
        name: "World War II",
        description: "Major events and figures of World War II",
      },
    })

    // Create subtopics
    const pacificWar = await db.topic.create({
      data: {
        name: "Pacific War",
        description: "Events in the Pacific Theater",
        parentId: worldWar2.id,
      },
    })

    // Create sample questions
    await db.question.createMany({
      data: [
        {
          topicId: worldWar2.id,
          question: "When did World War II begin in Europe?",
          options: ["1939", "1940", "1941", "1942"],
          correctIndex: 0,
          explanation: "World War II began in Europe with Germany's invasion of Poland on September 1, 1939.",
        },
        {
          topicId: worldWar2.id,
          question: "Who was the Prime Minister of the United Kingdom during most of World War II?",
          options: ["Neville Chamberlain", "Winston Churchill", "Clement Attlee", "Stanley Baldwin"],
          correctIndex: 1,
          explanation: "Winston Churchill served as Prime Minister from 1940 to 1945, leading Britain through most of World War II.",
        },
        {
          topicId: pacificWar.id,
          question: "What event brought the United States into World War II?",
          options: [
            "Attack on Pearl Harbor",
            "Battle of Midway",
            "Fall of Singapore",
            "Battle of Coral Sea"
          ],
          correctIndex: 0,
          explanation: "The Japanese attack on Pearl Harbor on December 7, 1941, led to the United States entering World War II.",
        },
      ],
    })

    console.log("Sample topics and questions created successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await db.$disconnect()
  }
}

main()
