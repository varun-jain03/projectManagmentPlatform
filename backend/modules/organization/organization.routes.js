// Dependencies
const express = require("express");

// File Imports
const { createOrg, myOrgs, getOrg, switchOrg, invite, members, updateRole, remove } = require('./organization.controller.js');
const authMiddleware = require('../../middleware/auth.middleware.js');
const requireOrgRole = require('../../middleware/orgRole.middleware.js');
const requireOrgContext = require('../../middleware/orgContext.middleware.js');

const orgRouter = express.Router();

// Organization Routers

orgRouter.post("/", authMiddleware, createOrg);              //create organization
orgRouter.get("/", authMiddleware, myOrgs);                  //fetch my organization
orgRouter.post("/switch", authMiddleware, switchOrg);        //swictching the organization


// RBCA Router 1: Getting All The Members Of The Organization
orgRouter.get(
  "/members",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin", "member"]),
  members
);

// RBCA Router 2: Inviting a new member to the Organization
orgRouter.post(
  "/member/invite",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  invite
);

// RBCA Router 3: Changing The Role Of The Member
orgRouter.patch(
  "/members/role",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  updateRole
);


// ORGANIZATION AND RBCA ROUTERS: Dynamic Routes 
// RBCA Rouuter 4: Removing The Member From The Organization
orgRouter.delete(
  "/members/:userId",
  authMiddleware,
  requireOrgContext,
  requireOrgRole(["owner", "admin"]),
  remove
);

orgRouter.get("/:id", authMiddleware, getOrg);               //fetching single organization




module.exports = orgRouter;