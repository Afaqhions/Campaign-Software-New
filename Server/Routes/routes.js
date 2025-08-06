import express from 'express';
import {
  getAllUsersController,
  loginController,
  registerUserController,
  updateUserController,
  deleteUserController,
} from '../Controllers/authUsersController.js';

import {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
} from '../Controllers/boardsController.js';

import upload from "../Middlewares/multerMiddleware.js";
import { verifyToken } from '../Middlewares/verifyToken.js';

import {
  createCampaign,
  deleteCampaign,
  getAllCampaigns,
  updateCampaign,
} from '../Controllers/addCampaignController.js';

import {
  getUploads,
  uploadServiceManPic,
} from '../Controllers/serviceManController.js';

import {
  assignCampaign,
  getAllAssignments,
  getAssignmentsByEmail,
} from '../Controllers/assignCampaignController.js';

import {
  verifyAllServiceManUploads,
  adminVerifyUploadById,
  adminGetAllUploads,
} from '../Controllers/verifyUploadController.js';
import { getVerifiedCampaignsForClient } from '../Controllers/verifiedClientCampaignsController.js';

const router = express.Router();

// ====================
// ✅ Auth Routes
// ====================
router.post('/auth/login', loginController);
router.post('/admin/register', registerUserController);
router.get('/users', verifyToken, getAllUsersController);
router.put('/users/:id', verifyToken, updateUserController);
router.delete('/users/:id', verifyToken, deleteUserController);

// ====================
// ✅ Board Routes
// ====================
router.get("/boards", getBoards);
router.post("/boards/create", verifyToken, createBoard);
router.put("/boards/:id", verifyToken, updateBoard);
router.delete("/boards/:id", verifyToken, deleteBoard);

// ====================
// ✅ Campaign Routes
// ====================
router.post("/campaigns/create", verifyToken, createCampaign);
router.get("/campaigns", verifyToken, getAllCampaigns);
router.delete("/delete-campaigns/:id", verifyToken, deleteCampaign);
router.put("/update-campaigns/:id", verifyToken, updateCampaign);

// ================================
// ✅ Service Man Upload Routes
// ================================
router.get("/get-uploads", verifyToken, getUploads); // Admin or serviceman
router.post("/upload-pic", verifyToken, upload.single("image"), uploadServiceManPic);

// ==============================
// ✅ Campaign Assignment Routes
// ==============================
router.post("/assign", verifyToken, assignCampaign);
router.get("/assign/all", verifyToken, getAllAssignments);
router.get("/assign/:email", verifyToken, getAssignmentsByEmail);

// ====================
// ✅ Client Routes
// Display verified campaigns for clients
// ====================
router.get("/verifications/client-campaigns", verifyToken, getVerifiedCampaignsForClient); // ✅ protected route

// =============================
// ✅ Verification Routes
// =============================

// ✅ Admin Verifies One Upload by ID
router.put('/admin-verify-upload/:uploadId', verifyToken, adminVerifyUploadById);

// ✅ Admin Verifies All Uploads
router.put('/admin-verify-all', verifyToken, verifyAllServiceManUploads);

// ✅ Admin Get All Uploads
router.get("/admin-get-uploads", verifyToken, adminGetAllUploads); // ✅ NEW for Admin only


export default router;
