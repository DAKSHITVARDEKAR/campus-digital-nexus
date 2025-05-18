
// Appwrite configuration for the application

// Core configuration
export const appwriteConfig = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: '68166b45001f2c121a55',
};

// Database configuration
export const dbConfig = {
  databaseId: 'campusNexusDB',
  collections: {
    elections: 'elections',
    candidates: 'candidates',
    votes: 'votes',
    complaints: 'complaints',
    facilities: 'facilities',
    bookingRequests: 'bookingRequests',
    applications: 'applications',
    integrityRecords: 'integrityRecords',
    budgets: 'budgets',
    expenseRecords: 'expenseRecords',
    achievements: 'achievements',
    tasks: 'tasks'
  }
};

// Storage configuration
export const storageConfig = {
  buckets: {
    profileImages: 'profile-images',
    attachments: 'attachments',
    proofs: 'proofs'
  }
};

// Teams (roles) configuration
export const teamsConfig = {
  students: 'students',
  faculty: 'faculty',
  admins: 'admins',
  electionAdmins: 'election-admins',
  facilityApprovers: 'facility-approvers',
  applicationApprovers: 'application-approvers',
  financeTeam: 'finance-team'
};

// Permissions schemas 
export const permissionSchemas = {
  // Example permission schema for elections
  elections: {
    student: {
      read: true,
      vote: true,
      create: false,
      update: false,
      delete: false,
      manage: false
    },
    faculty: {
      read: true,
      vote: true,
      create: false,
      update: false,
      delete: false,
      manage: true
    },
    admin: {
      read: true,
      vote: true,
      create: true,
      update: true,
      delete: true,
      manage: true
    }
  }
};

// Export combined config
export default {
  core: appwriteConfig,
  database: dbConfig,
  storage: storageConfig,
  teams: teamsConfig,
  permissions: permissionSchemas
};
