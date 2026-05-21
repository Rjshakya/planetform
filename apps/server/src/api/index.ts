import { Hono } from "hono";
import analytics from "./analytics";
import billing from "./billing";
import customDomain from "./custom.domain";
import fileUpload from "./file.upload";
import form from "./form";
import formField from "./form.field";
import integration from "./integration";
import respondent from "./respondent";
import response from "./response";
import subscription from "./subscription";
import workspace from "./workspace";

const api = new Hono()
  .route("/workspace", workspace)
  .route("/form", form)
  .route("/formField", formField)
  .route("/respondent", respondent)
  .route("/response", response)
  .route("/integration", integration)
  .route("/file", fileUpload)
  .route("/subscription", subscription)
  .route("/billing", billing)
  .route("/analytics", analytics)
  .route("/customDomain", customDomain);

export default api;
