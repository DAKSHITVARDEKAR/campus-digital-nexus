import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Initialize the Appwrite client
export const client = new Client();

// Set the endpoint and project ID from environment variables
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68166b45001f2c121a55');

// Initialize and export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export default client;