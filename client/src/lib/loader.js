import { redirect } from "react-router";
import { fetchWithAuth } from "./utils";



export async function dashboardLoader() {
    try {
        const response = await fetchWithAuth("/api/me");
        return await response.json();
    } catch (err) {
        console.error("Error fetching user data:", err);
        return redirect("/auth/login");
   }
}

export async function adminLoader() {
  const data = await dashboardLoader();

  if (data instanceof Response) {
    return data;
  }

  if (data?.user?.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  return data;
}

export async function authLoader() {
  try {
    const response = await fetchWithAuth("/api/me");
    if (response.ok) {
      return redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}
