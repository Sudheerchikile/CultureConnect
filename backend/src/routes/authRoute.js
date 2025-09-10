import express from 'express';
import { login, signup, logout, onboard } from '../controllers/authController.js';   
import { protectedRoute } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/login', login);


router.post('/signup', signup);


router.post('/logout', logout);



router.post("/onboard",protectedRoute, onboard)


// check if user is logged in

router.get('/me', protectedRoute, (req, res) => {
  res.status(200).json({ user: req.user ,success:true});     
}
);

export default router;