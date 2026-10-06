import NextAuth from "next-auth";

import authConfig from "./auth-config";

export const GET = async (req) => {
  return await NextAuth(req, authConfig).GET(req);
};

export const POST = async (req) => {
  return await NextAuth(req, authConfig).POST(req);
};