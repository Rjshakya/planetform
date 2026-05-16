import { AnimatePresence, motion } from "motion/react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { CommonMenu } from "@/components/common/common-menu";

const tabs = [
  {
    value: "submissions",
    label: "Submissions",
    pathPrefix: "/dashboard/submissions/",
  },
  {
    value: "analytics",
    label: "Analytics",
    pathPrefix: "/dashboard/analytics/",
  },
  {
    value: "integrations",
    label: "Integration",
    pathPrefix: "/dashboard/integrations/",
  },
  { value: "embed", label: "Embed", pathPrefix: "/dashboard/embed/" },
  { value: "settings", label: "Settings", pathPrefix: "/dashboard/settings/" },
];

export default function FormManageRoute() {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");

  const activeTab =
    tabs.find((t) => location.pathname.startsWith(t.pathPrefix))?.value ||
    "submissions";

  const handleTabClick = (pathPrefix: string) => {
    navigate(`${pathPrefix}${formId}?name=${formName}&workspace=${workspace}`);
  };

  return (
    <div className="max-w-3xl mx-auto  pb-8">
      <CommonMenu />

      <div className="md:w-fit overflow-hidden ">
        <div className="flex relative  bg-muted rounded-3xl p-1 gap-1 overflow-y-scroll ">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabClick(tab.pathPrefix)}
              className={` cursor-pointer relative capitalize px-4 py-2.5 text-xs font-medium  rounded-2xl transition-colors ${
                activeTab === tab.value
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === tab.value && (
                <motion.div
                  layoutId="formManageActiveTab"
                  className="absolute inset-0 bg-input rounded-2xl"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative ">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-4"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
