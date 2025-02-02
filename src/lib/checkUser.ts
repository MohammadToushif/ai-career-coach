import { currentUser, User } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { User as PrismaUser } from "@prisma/client"; // Import the Prisma User type

export const checkUser = async (): Promise<PrismaUser | null> => {
  try {
    const user: User | null = await currentUser();

    if (!user) {
      return null;
    }

    // Ensure email exists to avoid undefined errors
    const email: string | undefined = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      throw new Error("User has no email address associated.");
    }

    // Find existing user in the database
    const loggedInUser: PrismaUser | null = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // Construct the full name safely
    const name: string = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ");

    // Create a new user in the database
    const newUser: PrismaUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error);
    throw error; // Ensure the error is properly handled by the caller
  }
};

/* JS version */

// import { currentUser } from "@clerk/nextjs/server";
// import { db } from "./prisma";

// export const checkUser = async () => {
//   try {
//     const user = await currentUser();

//     if (!user) {
//       return null;
//     }

//     // Ensure email exists to avoid undefined errors
//     const email = user.emailAddresses?.[0]?.emailAddress;
//     if (!email) {
//       throw new Error("User has no email address associated.");
//     }

//     // Find existing user
//     const loggedInUser = await db.user.findUnique({
//       where: { clerkUserId: user.id }, // Fixed `user.Id` to `user.id`
//     });

//     if (loggedInUser) {
//       return loggedInUser;
//     }

//     // Construct the full name safely
//     const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

//     // Create new user in DB
//     return await db.user.create({
//       data: {
//         clerkUserId: user.id,
//         name,
//         imageUrl: user.imageUrl,
//         email,
//       },
//     });
//   } catch (error) {
//     console.error("Error in checkUser:", error);
//     throw error; // Ensure the error is properly handled by the caller
//   }
// };
