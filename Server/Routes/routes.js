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
  getBoardsByCity,
  getServiceManByCity, // ✅ fixed import name
  updateCampaign,
} from '../Controllers/addCampaignController.js';

import {
  getUploads,
  uploadServiceManPic,
} from '../Controllers/serviceManController.js';


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
router.get("/boards/city/:city", getBoardsByCity); // ✅ changed path to avoid conflict
router.get("/service-men/city/:city", getServiceManByCity); // ✅ fixed path + import

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
router.get("/get-uploads", verifyToken, getUploads);
router.post("/upload-pic", verifyToken, upload.single("image"), uploadServiceManPic);

// ====================
// ✅ Client Routes
// ====================
router.get("/verifications/client-campaigns", verifyToken, getVerifiedCampaignsForClient);

// =============================
// ✅ Verification Routes
// =============================
router.put('/admin-verify-upload/:uploadId', verifyToken, adminVerifyUploadById);
router.put('/admin-verify-all', verifyToken, verifyAllServiceManUploads);
router.get("/admin-get-uploads", verifyToken, adminGetAllUploads);

export default router;
