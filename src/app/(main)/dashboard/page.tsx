import React from "react";
import { getUserOnboardingStatus } from "@/app/actions/userActions";
import { redirect } from "next/navigation";
import DashboardView from "./_components/DashboardView";
import { getIndustryInsights } from "@/app/actions/dashboardActions";

const DashboardPage: React.FC = async () => {
  // check if the user is already onboarding
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");

  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
};

export default DashboardPage;
