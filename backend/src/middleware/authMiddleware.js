import jwt from "jsonwebtoken"; 
import User from "../models/User.js";


export const protectedRoute=async(req,res,next)=>{
  const token = req.cookies.jwt;

  console.log("👉 ProtectedRoute attached user:", req.user);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token, please login" });
  }

 const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }

  try {
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     
    req.user = user; 
    req.user = user; // ✅ attach user
    console.log("👉 ProtectedRoute attached user:", req.user);// Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in protectedRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }     
}