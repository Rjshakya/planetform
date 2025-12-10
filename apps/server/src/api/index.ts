import { Hono } from "hono";
import workspace from "./workspace";
import form from "./form";
import formField from "./form.field";
import respondent from "./respondent";
import response from "./response";
import integration from "./integration";
import fileUpload from "./file.upload";
import subscription from "./subscription";
import analytics from "./analytics";

const api = new Hono()
  .route("/workspace", workspace)
  .route("/form", form)
  .route("/formField", formField)
  .route("/respondent", respondent)
  .route("/response", response)
  .route("/integration", integration)
  .route("/file", fileUpload)
  .route("/subscription", subscription)
  .route("/analytics", analytics)

export default api;
