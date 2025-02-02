import React from "react";

interface CoverLetterProps {
  params: { id: string };
}

const CoverLetter: React.FC<CoverLetterProps> = async ({ params }) => {
  const Id = params.id;
  return <div>CoverLetter: {Id}</div>;
};

export default CoverLetter;
