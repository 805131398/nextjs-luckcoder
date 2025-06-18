import getServerSession from "next-auth";
import { authConfig } from "@/lib/authConfig";

export async function getSession() {
    return await getServerSession(authConfig);
}