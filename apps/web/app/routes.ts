import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  index("features/marketing/page.tsx"),
  route("pricing", "features/pricing/page.tsx"),
  route("auth", "features/auth/page.tsx"),

  layout("features/auth/protected.tsx", [
    route("dashboard", "features/dashboard/route.tsx", [
      index("features/dashboard/page.tsx"),
      route(":workspaceId", "features/workspace/route.tsx", [
        index("features/workspace/page.tsx"),
      ]),
      route("custom-domains", "features/custom-domain/route.tsx", [
        index("features/custom-domain/page.tsx"),
      ]),
      route("billing", "features/billing/route.tsx", [
        index("features/billing/page.tsx"),
      ]),

      layout("features/form-manage/route.tsx", [
        route("submissions/:formId", "features/submissions/page.tsx"),
        route("analytics/:formId", "features/analytics/page.tsx"),
        route("integrations/:formId", "features/integrations/page.tsx"),
        route("embed/:formId", "features/embed/page.tsx"),
        route("settings/:formId", "features/form-settings/page.tsx"),
      ]),
    ]),

    route(":formId/edit", "features/edit-form/page.tsx"),
    route("preview", "features/preview/page.tsx"),
  ]),

  route(":formId", "features/form/route.tsx", [
    index("features/form/page.tsx"),
    route("verify", "features/form/verify-page.tsx"),
  ]),
] satisfies RouteConfig;
