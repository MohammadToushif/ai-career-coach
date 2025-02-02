import React from "react";
import OnboardingForm from "./_components/OnboardingForm";
import { industries } from "@/data/industries";
import { getUserOnboardingStatus } from "@/app/actions/userActions";
import { redirect } from "next/navigation";

const OnboardingPage: React.FC = async () => {
  // check if the user is already onboarding
  const { isOnboarded } = await getUserOnboardingStatus();
  if (isOnboarded) redirect("/dashboard");

  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};

export default OnboardingPage;
