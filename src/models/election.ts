
export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  positions: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  electionId: string;
  studentName: string;
  studentId: string;
  position: string;
  manifesto: string;
  imageUrl: string | null;
  department: string;
  year: string;
  status: string;
  voteCount: number;
  submittedAt: string;
}

export interface Vote {
  id: string;
  electionId: string;
  candidateId: string;
  userId: string;
  timestamp: string;
}

export interface ElectionResult {
  electionId: string;
  position: string;
  candidates: { id: string; name: string; voteCount: number }[];
  totalVotes: number;
}
