"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface IndustryInsights {
  salaryRanges: Array<{
    role: string;
    min: number;
    max: number;
    median: number;
    location: string;
  }>;
  growthRate: number;
  demandLevel: "High" | "Medium" | "Low";
  topSkills: string[];
  marketOutlook: "Positive" | "Neutral" | "Negative";
  keyTrends: string[];
  recommendedSkills: string[];
}

// Ensure API Key is set
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate AI Insights
export const generateAiInsights = async (
  industry: string
): Promise<IndustryInsights> => {
  const prompt = `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
  {
    "salaryRanges": [
      { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
    ],
    "growthRate": number,
    "demandLevel": "High" | "Medium" | "Low",
    "topSkills": ["skill1", "skill2"],
    "marketOutlook": "Positive" | "Neutral" | "Negative",
    "keyTrends": ["trend1", "trend2"],
    "recommendedSkills": ["skill1", "skill2"]
  }
  IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
  Include at least 5 common roles for salary ranges.
  Growth rate should be a percentage.
  Include at least 5 skills and trends.`;

  try {
    const result = await model.generateContent(prompt);

    if (!result.response) {
      throw new Error("Invalid AI response");
    }

    // Extract AI response text properly
    const text = result.response?.text() || "";
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    // JSON.parse() converts the string response into a JS object.
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating AI content:", error);
    throw new Error("Failed to generate AI insights");
  }
};

// Fetch Industry Insights
export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found.");
  if (!user.industry) throw new Error("User industry not set.");

  if (!user.industryInsight) {
    const insights = await generateAiInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: String(user.industry),
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
