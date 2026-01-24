import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";
import Landing from "./pages/Landing";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import { DashboardHome } from "./components/dashboard/home";
import { WorkspaceHome } from "./components/workspace/home";
import { Protected } from "./components/protected-component";
import { ThemeProvider, useTheme } from "./components/common/theme-provider";

import { Editor } from "./pages/editor";
import { EditorHome } from "./components/editor/home";
import { FormHome } from "./components/form/home";
import { EditFormHome } from "./components/edit-form/edit";
import { SubmissionHome } from "./components/submissions/home";
import { AnalyticsHome } from "./components/analytics/home";
import { IntegrationsHome } from "./components/integrations/home";
import { FormSettingHome } from "./components/form-settings/home";

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
        path: "/settings/:formId",
        element: <FormSettingHome />,
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
    ],
  },
]);

export function App() {
  return (
    <SWRConfig>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster theme={useTheme().theme} richColors position="top-right" />
      </ThemeProvider>
    </SWRConfig>
  );
}

export default App;
