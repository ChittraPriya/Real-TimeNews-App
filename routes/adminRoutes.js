const express = require("express");

const { isAuthenticated } = require("../middleware/auth");
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
adminRouter.post("/news",isAuthenticated,isAdmin,createNews);
adminRouter.get("/news",isAuthenticated,isAdmin,getAllNews);
adminRouter.put("/news/:id",isAuthenticated,isAdmin,updateNews);
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