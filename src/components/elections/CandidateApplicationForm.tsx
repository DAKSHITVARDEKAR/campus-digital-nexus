
import React from 'react';
import { Candidate } from '@/models/election';

export type CandidateApplicationType = Candidate;

interface CandidateApplicationFormProps {
  electionId: string;
}

const CandidateApplicationForm: React.FC<CandidateApplicationFormProps> = ({ electionId }) => {
  return (
    <div>
      <h2>Apply as a Candidate</h2>
      <p>Form implementation will go here. The election ID is: {electionId}</p>
    </div>
  );
};

export default CandidateApplicationForm;
