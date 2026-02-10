import { registerUser, loginUser } from "./auth.service.js";
import { success, error } from "../../utils/response.js";

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, "Username and password are required");
    }

    await registerUser({ username, password });
    return success(res, "User registered successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, "Username and password are required");
    }

    const data = await loginUser({ username, password });
    return success(res, "Login successful", data);
  } catch (err) {
    return error(res, err.message, 401);
  }
};
