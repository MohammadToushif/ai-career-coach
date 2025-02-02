"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAiInsights } from "./dashboardActions";

// Define the expected structure of user update data
interface UpdateUserData {
  industry: string;
  experience: number;
  bio: string;
  skills: string[];
}

/* ## Actions are nothing just an API which we were previously write in api folder */
export async function updateUser(data: UpdateUserData) {
  // check user is onboarding or not
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found.");

  try {
    const result = await db.$transaction(
      async (tx) => {
        // Find if the industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with AI
        if (!industryInsight) {
          const insights = await generateAiInsights(data.industry);

          industryInsight = await db.industryInsight.create({
            data: {
              industry: String(data.industry),
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
            },
          });
        }

        // Update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000, // 10 seconds timeout
      }
    );

    return { succcess: true, ...result };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
}

export async function getUserOnboardingStatus() {
  // Check if the user is authenticated
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // Fetch only the necessary field
    const userIndustry = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true, // Only fetch industry field
      },
    });

    return { isOnboarded: !!userIndustry?.industry };
    // !! (Double Bang) is used to convert a value to a boolean
  } catch (error) {
    console.error("Error while getting User Onboarding Status:", error);
    throw new Error("Failed to get User Onboarding Status");
  }
}
