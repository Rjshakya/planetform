import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnalyticsHome } from "./components/analytics/home";
import { ThemeProvider, useTheme } from "./components/common/theme-provider";
import { DashboardHome } from "./components/dashboard/home";
import { EditFormHome } from "./components/edit-form/edit";
import { EditorHome } from "./components/editor/home";
import { EmbedHome } from "./components/embed/home";
import { FormManageLayout } from "./components/form-manage-layout";
import { FormHome } from "./components/form/home";
import { VerifyPasswordPage } from "./components/form/verify-password";
import { FormSettingHome } from "./components/form-settings/home";
import { IntegrationsHome } from "./components/integrations/home";
import { PreviewHome } from "./components/preview/home";
import { Protected } from "./components/protected-component";
import { SubmissionHome } from "./components/submissions/home";
import { WorkspaceHome } from "./components/workspace/home";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { Editor } from "./pages/editor";
import Landing from "./pages/Landing";
import Workspace from "./pages/Workspace";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    element: <Protected />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: ":workspaceId",
            element: <Workspace />,
            children: [
              {
                index: true,
                element: <WorkspaceHome />,
              },
            ],
          },
        ],
      },
      {
        path: "/editor",
        element: <Editor />,
        children: [
          {
            index: true,
            element: <EditorHome />,
          },
        ],
      },
      {
        path: "/:formId/edit",
        element: <EditFormHome />,
      },
      {
        element: <FormManageLayout />,
        children: [
          {
            path: "/submissions/:formId",
            element: <SubmissionHome />,
          },
          {
            path: "/analytics/:formId",
            element: <AnalyticsHome />,
          },
          {
            path: "/integrations/:formId",
            element: <IntegrationsHome />,
          },
          {
            path: "/embed/:formId",
            element: <EmbedHome />,
          },
          {
            path: "/settings/:formId",
            element: <FormSettingHome />,
          },
        ],
      },
      {
        path: "/preview",
        element: <PreviewHome />,
      },
    ],
  },
  {
    path: "/:formId",
    children: [
      {
        index: true,
        element: <FormHome />,
      },
      {
        path: "verify",
        element: <VerifyPasswordPage />,
      },
    ],
  },
]);

export function App() {
  return (
    <SWRConfig>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster theme={useTheme().theme} richColors position="top-right" />
        </TooltipProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default App;
