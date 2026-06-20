import { redirect } from "react-router";
import { RegisterSchemas, LoginSchemas } from "./zodType";


export const register = async ({ request }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  try {
    const formData = await request.formData();

    const result = Object.fromEntries(formData);
    const confirmPassword = result.confirmPassword;

    console.log(result);

    const parsedData = RegisterSchemas.safeParse(result);

    if (!parsedData.success) {
      return {
        errors: parsedData.error.flatten().fieldErrors,
        message: "Invalid form input",
      };
    }

    const { password, ...registerData } = parsedData.data;

    if (password !== confirmPassword) {
      return {
        errors: {
          confirmPassword: ["Password does not match"],
        },
        message: "Invalid form input",
      };
    }
    console.log(confirmPassword);

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...registerData,
        password,
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || "Registration failed",
      };
    }

    console.log(data);

    return redirect("/auth/login");
  } catch (err) {
    console.error(err);

    return {
      message: "Something went wrong",
    };
  }
};

export const login = async ({ request }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  try {
    const formData = await request.formData();

    const email = formData.get("email");
    const password = formData.get("password");

    const parsedData = LoginSchemas.safeParse({ email, password });

    if (!parsedData.success) {
      return {
        errors: parsedData.error.flatten().fieldErrors,
        message: "Invalid Input",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        message: data.message || "Login failed",
      };
    }
    console.log(data);
    return redirect("/dashboard");
  } catch (err) {
    console.error(err);

    return {
      message: "Something went wrong",
    };
  }
};