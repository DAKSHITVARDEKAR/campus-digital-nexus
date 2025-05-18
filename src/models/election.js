
// Export all interfaces and types
const ElectionStatus = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  CLOSED: 'closed',
  CANCELLED: 'cancelled', 
  COMPLETED: 'completed'
};

// Functions for permission checking that mockElectionApi.js is trying to import
const getElectionPermissions = (role, election, isCreator = false) => {
  return {
    canCreate: role === 'Admin' || role === 'Faculty',
    canRead: true,
    canUpdate: role === 'Admin' || (role === 'Faculty' && isCreator),
    canDelete: role === 'Admin' || (role === 'Faculty' && isCreator),
    canVote: (role === 'Student' || role === 'Faculty') && election?.status === 'active',
    canApproveRejectCandidates: role === 'Admin' || role === 'Faculty'
  };
};

const getCandidatePermissions = (role, candidate, userId) => {
  const isOwner = candidate && candidate.studentId === userId;
  
  return {
    canCreate: role === 'Student',
    canRead: true,
    canUpdate: role === 'Admin' || isOwner,
    canDelete: role === 'Admin' || isOwner,
    canApprove: role === 'Admin' || role === 'Faculty',
    canReject: role === 'Admin' || role === 'Faculty'
  };
};

export {
  ElectionStatus,
  getElectionPermissions,
  getCandidatePermissions
};
