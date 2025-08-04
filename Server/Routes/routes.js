// routes/authRoutes.js
import express from 'express';
import {
  getAllUsersController,
  loginController,
  registerUserController,
  updateUserController,
  deleteUserController
} from '../Controllers/authUsersController.js';

import {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard
} from '../Controllers/boardsController.js';

import upload from "../Middlewares/multerMiddleware.js"; // Import the Multer middleware
import { verifyToken } from '../Middlewares/verifyToken.js';
import { createCampaign, deleteCampaign, getAllCampaigns, updateCampaign } from '../Controllers/addCampaignController.js';
import { getServiceManUploads, uploadServiceManPic } from '../Controllers/serviceManController.js';

const router = express.Router();

// Auth routes
router.post('/auth/login', loginController);
router.post('/admin/register', registerUserController);

// Display all users
router.get('/users', verifyToken, getAllUsersController);

// Update and delete user routes
router.put('/users/:id', verifyToken, updateUserController);
router.delete('/users/:id', verifyToken, deleteUserController);

// Board routes
router.get("/boards", getBoards); // public or you can protect it if needed
router.post("/boards/create", verifyToken, createBoard);
router.put("/boards/:id", verifyToken, updateBoard);
router.delete("/boards/:id", verifyToken, deleteBoard);

// Campaign routes

router.post("/campaigns/create", verifyToken, createCampaign);
router.get("/campaigns", verifyToken, getAllCampaigns); // For creating campaigns
router.delete("/delete-campaigns/:id", verifyToken, deleteCampaign); // For Deleting campaigns
router.put("/update-campaigns/:id", verifyToken, updateCampaign); // For update campaigns

// Pic by Service Man Routes
// Get uploads by service man
router.get("/get-uploads", verifyToken, getServiceManUploads);
router.post("/upload-pic", verifyToken, upload.single("image"), uploadServiceManPic);

export default router;