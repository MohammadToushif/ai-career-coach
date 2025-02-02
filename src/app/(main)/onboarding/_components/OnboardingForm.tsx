interface Industry {
    id: string;
    name: string;
    subIndustries: string[];
  }
  
  interface OnboardingFormProps {
    industries: Industry[];
  }
  
  const OnboardingForm: React.FC<OnboardingFormProps> = ({ industries }) => {
    return (
      <div>
        <h1>Onboarding Form</h1>
        <ul>
          {industries.map((industry) => (
            <li key={industry.id}>{industry.name}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default OnboardingForm;
  