import { Client, Databases, Storage, Account } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68166b45001f2c121a55')
    .setKey(process.env.APPWRITE_API_KEY || 'standard_50a9a5aaded883dab818781f457070c4a6c7f8b1e6fcce4d62c7452c26bd04d14ed94d0128e66742dbbccbe7ca383a5f3aeab3b7f718bfa2621fddbf4986e6ae9f3f2ac43e3971623f827047c8bdc14d018e6ab90e87237f545c1577607a80c6fa092b6617a03ae630cc25061b37dfcc933325b3daaed63b6e6f8e4be2f4daf3');

// Initialize Services
const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);

// Constants
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'default';
const ELECTIONS_COLLECTION_ID = process.env.VITE_APPWRITE_ELECTIONS_COLLECTION_ID || 'elections';
const CANDIDATES_COLLECTION_ID = process.env.VITE_APPWRITE_CANDIDATES_COLLECTION_ID || 'candidates';
const VOTES_COLLECTION_ID = process.env.VITE_APPWRITE_VOTES_COLLECTION_ID || 'votes';
const USERS_COLLECTION_ID = 'users'; // Collection for user profiles
const FACILITIES_COLLECTION_ID = 'facilities';
const BOOKINGS_COLLECTION_ID = 'bookings';
const APPLICATIONS_COLLECTION_ID = 'applications';
const BUDGET_COLLECTION_ID = 'budgets';
const COMPLAINTS_COLLECTION_ID = 'complaints';
const BUCKET_ID = process.env.VITE_APPWRITE_BUCKET_ID || 'election_assets';

export {
    client,
    databases,
    storage,
    account,
    DATABASE_ID,
    ELECTIONS_COLLECTION_ID,
    CANDIDATES_COLLECTION_ID,
    VOTES_COLLECTION_ID,
    USERS_COLLECTION_ID,
    FACILITIES_COLLECTION_ID,
    BOOKINGS_COLLECTION_ID,
    APPLICATIONS_COLLECTION_ID,
    BUDGET_COLLECTION_ID,
    COMPLAINTS_COLLECTION_ID,
    BUCKET_ID
};