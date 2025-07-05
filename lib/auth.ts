import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const getSessionServer = async () => {
  return await getServerSession(authOptions);
};