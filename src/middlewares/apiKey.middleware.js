export const verifyApiKey = (req, res, next) => {

  console.log("HEADERS:", req.headers);

  const apiKey = req.headers["x-api-key"];

  console.log("Received:", apiKey);
  console.log("Expected:", process.env.ATTENDANCE_SECRET);

  if (!apiKey || apiKey !== process.env.ATTENDANCE_SECRET) {
    return res.status(401).json({ message: "Unauthorized API access" });
  }

  next();
};
