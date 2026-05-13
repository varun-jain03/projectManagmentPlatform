// File Imports
const { createOrganization, getMyOrganization, getOrganizationById, switchOrganization } = require('./organization.service.js');
const { inviteUser, listMembers, changeMemberRole, removeMember } = require('./organization.membership.service.js');
const ApiResponse  = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiError = require('../../utils/ApiError.js');

// Creating a Organization
const createOrg = asyncHandler(async (req, res) => {
  const org = await createOrganization({
    name: req.body.name,
    userId: req.user.userId
  });
  res.status(201).json(new ApiResponse(201, org, "Organization Created..."));
})

// Get Users Organization
const myOrgs = asyncHandler(async (req, res) => {
  const orgs = await getMyOrganization({
    userId: req.user.userId
  });
  console.log(req.user);
  res.status(200).json(new ApiResponse(200, orgs, `All The Organizations Fetched...`));
})

// Get A Single Organization By Id
const getOrg = asyncHandler(async (req, res) => {
  const org = await getOrganizationById({
    userId: req.user.userId,
    orgId: req.params.id
  });

  res.status(200).json(new ApiResponse(200, org, `${org.name} details fetched...`))
})

// Switching Organization From All The Organizations User Is Part Of
const switchOrg = asyncHandler(async (req, res) => {
  const { organizationId } = req.body;
  if (!organizationId) {
    return res.status(400).json(new ApiResponse(400, null, "Organization Not Found..."));
  };

  const result = await switchOrganization({
    userId: req.user.userId,
    orgId: organizationId,
    globalRole: req.user.role
  });

  res.status(200).json(new ApiResponse(200, result, "Organization Switched..."));
});

// ORGANIZATION.MEMBERSHIP.CONTROLLER.JS
// Invite new member to orgainzation
const invite = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json(new ApiResponse(400, "Name And Email Is Required..."));
  }
  console.log(req.user)
  const membership = await inviteUser({
    orgId: req.user.orgId,
    inviterUserId: req.user.userId,
    inviteeEmail: email,
    role
  });

  res.status(201).json(new ApiResponse(201, membership, "User Added To Organization..."));
});

// All The Members Of The Oragnization
const members = asyncHandler(async (req, res) => {
  const list = await listMembers({ orgId: req.user.orgId });
  res.status(200).json(new ApiResponse(200, list, "Members Fetched..."));
})

// Changing The Role Of The Member
const updateRole = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  const updated = await changeMemberRole({
    orgId: req.user.orgId,
    targetUserId: userId,
    newRole: role,
    requesterOrgRole: req.user.orgRole
  });

  res.status(200).json(new ApiResponse(200, updated, "Role Updated...")); 
});

// Romoving The Member From The Organization
const remove = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  await removeMember({
    orgId: req.user.orgId,
    targetUserId: userId,
    requesterUserId: req.user.userId,
    requesterOrgRole: req.user.orgRole
  });

  res.status(200).json(new ApiResponse(200, null, "Member Removed..."));
});

module.exports = { createOrg, myOrgs, getOrg, switchOrg, invite, members, updateRole, remove };