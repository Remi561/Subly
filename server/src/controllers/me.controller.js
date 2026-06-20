import { id } from "zod/v4/locales";

export async function getMe(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

    try {
        // The requireAuth middleware should have already verified the token and set req.user
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({message: "User information retrieved successfully", user:{username: user.username, id:user.id, role: user.role, baseCurrency: user.baseCurrency} });
    } catch (err) {
        next(err);
     }
}