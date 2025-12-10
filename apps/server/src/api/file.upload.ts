import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import {
  deleteFileService,
  generatePresignerUrlByRespondent,
  generatePresignerUrlByWrkspace,
  generatePutPresignedUrlService,
} from "../services/file.upload";
import { authMiddleware } from "../middlewares/authMiddleware";

const fileUpload = new Hono<{
  Variables: {
    userId: string | null;
  };
}>()

  .post(
    "/",
    zValidator(
      "json",
      z.object({
        fileName: z.string().nonoptional(),
        folder: z.string().nonoptional(),
      })
    ),
    async (c) => {
      const { fileName, folder } = c.req.valid("json");
      const url = await generatePutPresignedUrlService(fileName, folder);
      return c.json({ url }, 200);
    }
  )

  .post(
    "/workspace",
    zValidator(
      "json",
      z.object({
        fileName: z.string().nonoptional(),
        workspaceId: z.string().nonoptional(),
      })
    ),
    async (c) => {
      const { fileName, workspaceId } = c.req.valid("json");
      const url = await generatePresignerUrlByWrkspace(fileName, workspaceId);
      if (!url) {
        return c.json(
          { message: "Workspace not found or limit exceeded" },
          400
        );
      }

      return c.json({ url }, 200);
    }
  )

  .post(
    "/respondent",
    zValidator(
      "json",
      z.object({
        fileName: z.string().nonoptional(),
        formId: z.string().nonoptional(),
        respondentId: z.string().nonoptional(),
      })
    ),
    async (c) => {
      const params = c.req.valid("json");
      const url = await generatePresignerUrlByRespondent(params);
      if (!url) {
        return c.json(
          { message: "Respondent not found or limit exceeded" },
          400
        );
      }
      return c.json({ url }, 200);
    }
  )

  .delete(
    "/:key",
    zValidator("param", z.object({ key: z.string().nonempty().nonoptional() })),
    async (c) => {
      const { key } = c.req.valid("param");
      await deleteFileService(key);
      return c.json({ message: "File deleted successfully" }, 200);
    }
  )

  .put(
    "/delete",
    zValidator("json", z.object({ key: z.string().nonempty().nonoptional() })),
    async (c) => {
      const { key } = c.req.valid("json");
      await deleteFileService(key);
      return c.json({ message: "File deleted successfully" }, 200);
    }
  );

export default fileUpload;
