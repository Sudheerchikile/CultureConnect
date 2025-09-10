import {generateStreamToken}  from "../lib/stream.js";

// export async function getStreamToken(req, res) {
//   try {
//     const token = generateStreamToken(req.user.id);

//     res.status(200).json({ token });
//   } catch (error) {
//     console.log("Error in getStreamToken controller:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }


export async function getStreamToken(req, res) {
  try {
    console.log("👉 req.user in getStreamToken:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const userId = req.user._id.toString();
    const token = await generateStreamToken(userId); // ✅ ensure await here
    console.log("✅ Generated Stream token:", token);

    res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Error generating Stream token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}