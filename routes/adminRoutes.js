const express = require("express");

const { isAuthenticated } = require("../middleware/auth");
const upload = require("../middleware/multer");
const { isAdmin } = require("../middleware/admin");

const {
  createNews,
  deleteNews,
  getUsers,
  stats,
  getAlertAdmin,
  getAllNews,
  updateNews,
  getAnalytics
} = require("../controller/adminController");

const adminRouter =express.Router();

/* NEWS */
adminRouter.post("/news",isAuthenticated,isAdmin,upload.single("image"),createNews);
adminRouter.get("/news",isAuthenticated,isAdmin,getAllNews);
adminRouter.put("/news/:id",isAuthenticated,isAdmin,upload.single("image"),updateNews);
adminRouter.delete("/news/:id",isAuthenticated,isAdmin,deleteNews);

/* USERS */
adminRouter.get("/users",isAuthenticated,isAdmin,getUsers);

/* STATS */
adminRouter.get("/stats",isAuthenticated,isAdmin,stats);

/* ALERTS */
adminRouter.get("/alerts",isAuthenticated,isAdmin,getAlertAdmin);

/* ANALYTICS */
adminRouter.get("/analytics",isAuthenticated,isAdmin,getAnalytics);

module.exports =adminRouter;