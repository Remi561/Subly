import { redirect } from "react-router";
import { fetchWithAuth } from "./utils";



export async function dashboardLoader() {
    try {
        const response = await fetchWithAuth("/api/me");
        return await response.json();
    } catch (err) {
        console.error("Error fetching user data:", err);
        redirect("/auth/login"); // Redirect to login page if unauthorized or on error
   }
}

