import express from "express";
import { protectedRoute } from "../middleware/authMiddleware.js";
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from "../controllers/userController.js";

const router = express.Router();

router.use(protectedRoute); 
// Apply protectedRoute middleware to all routes in this file


router.get('/', getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);

router.get("/friend-requests",getFriendRequests);

router.get("/outgoing-requests",getOutgoingFriendReqs)



export default router;