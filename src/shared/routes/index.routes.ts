import auditTrailRoute from "../../v1/modules/moduleName/routes/audit-trail.route";
import appRoute from "../../v1/modules/app/app.route";
import healthRoute from "../../v1/modules/health/health.route";
import userRoute from "../../v1/modules/userManagement/routes/user.route";
import authRoute from "../../v1/modules/userManagement/routes/auth.route";


export default {
  app: appRoute,
  health: healthRoute,
  auditTrail: auditTrailRoute,
  userManagement: userRoute,
  auth: authRoute,
};
