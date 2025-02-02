import React from "react";
import { getUserOnboardingStatus } from "@/app/actions/userActions";
import { redirect } from "next/navigation";

const DashboardPage: React.FC = async () => {
  // check if the user is already onboarding
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");

  return <div>DashboardPage</div>;
};

export default DashboardPage;
