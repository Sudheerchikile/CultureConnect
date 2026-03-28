import express from "express";
import { protectedRoute } from "../middleware/authMiddleware.js";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
  clearAcceptedRequest,
  clearAllAcceptedRequests,
} from "../controllers/userController.js";

const router = express.Router();

router.use(protectedRoute); 
// Apply protectedRoute middleware to all routes in this file


router.get('/', getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);
router.put("/friend-request/:id/decline",declineFriendRequest);

router.get("/friend-requests",getFriendRequests);
router.get("/outgoing-requests",getOutgoingFriendReqs);

router.delete("/accepted-requests/:id", clearAcceptedRequest);
router.delete("/accepted-requests", clearAllAcceptedRequests);



export default router;