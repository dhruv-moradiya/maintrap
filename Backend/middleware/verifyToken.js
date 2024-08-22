import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token provided" });

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error", error.message);
  }
};
