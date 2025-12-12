import { usePathname } from "next/navigation";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import { LinkContent } from "@/components/tiptap-ui/link-popover";

import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";
import { TiptapMarkDropdown } from "@/components/tiptap-mark-dropdown";
import { TiptapTextAlignDropdown } from "@/components/tiptap-text-align-dropdown";
import { CutomizationPanel } from "@/components/custom-nodes/CutomizationPanel";
import { PreviewButton } from "@/app/dashboard/[workspaceId]/form/create/_components/PreviewBtn";
import { EditForm } from "@/app/dashboard/[workspaceId]/form/edit/[formId]/_components/EditForm";
import { PublishForm } from "@/app/dashboard/[workspaceId]/form/create/_components/PublishForm";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, HighlighterIcon, LinkIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";
import React, { memo } from "react";
import { Editor } from "@tiptap/core";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const MainToolbarContent = ({
  onHighlighterClick,
  // onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  const path = usePathname();
  const forEditPage = path.includes(`/edit/`);

  return (
    <div
      className={cn(
        `bg-background w-full flex overflow-x-auto overscroll-x-contain overscroll-contain pb-2 pt-1  select-none`,
        `${
          isMobile
            ? `border-t-2  border-border/80`
            : `border-b-2 border-border/50`
        }`
      )}
    >
      {path !== "/" && path !== "/landing" && (
        <ToolbarGroup>
          <SidebarTrigger />
        </ToolbarGroup>
      )}
      {isMobile && <Separator className="mx-2" orientation="vertical" />}
      <div className="flex-1"></div>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <Separator className="mx-2" orientation="vertical" />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <Separator className="mx-2" orientation="vertical" />

      <ToolbarGroup>
        <TiptapMarkDropdown />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {/* {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />} */}
      </ToolbarGroup>

      <Separator className="mx-2" orientation="vertical" />

      <ToolbarGroup>
        <TiptapTextAlignDropdown />
      </ToolbarGroup>

      <ToolbarGroup>
        <CutomizationPanel />
      </ToolbarGroup>

      <Separator className="mx-2" orientation="vertical" />

      <ToolbarGroup className="ml-2">
        <PreviewButton />
      </ToolbarGroup>

      <ToolbarGroup className="ml-2">
        {forEditPage ? <EditForm /> : <PublishForm />}
      </ToolbarGroup>

      <div className="flex-1"></div>
      {isMobile && <Separator className="mx-2" orientation="vertical" />}
      {/* <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup> */}
      {/* {isMobile && <ToolbarSeparator />} */}
    </div>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => {
  return (
    <>
      <ToolbarGroup>
        <Button data-style="ghost" onClick={onBack}>
          <ArrowLeftIcon className="tiptap-button-icon" />
          {type === "highlighter" ? (
            <HighlighterIcon className="tiptap-button-icon" />
          ) : (
            <LinkIcon className="tiptap-button-icon" />
          )}
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      {type === "highlighter" ? (
        <ColorHighlightPopoverContent />
      ) : (
        <LinkContent />
      )}
    </>
  );
};

export const TiptapToolBar = memo(function ToolBarComp({
  editor,
}: {
  editor: Editor | null;
}) {
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const path = usePathname();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const rect = useCursorVisibility({
    editor: editor ? editor : null,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return (
    <Toolbar
      className={cn(
        "w-full z-30  ",
        `${isMobile ? " fixed inset-x-0 top-0" : "sticky top-0"}`,
        `${isMobile && (path === "/" || path === "/landing") && "hidden"}`
      )}
      ref={toolbarRef}
      // style={{
      //   ...(isMobile
      //     ? {
      //         bottom: `calc(100% - ${height - rect.y}px)`,
      //       }
      //     : {}),
      // }}
    >
      <div className=" flex gap-2 ">
        {mobileView === "main" ? (
          <MainToolbarContent
            onHighlighterClick={() => setMobileView("highlighter")}
            onLinkClick={() => setMobileView("link")}
            isMobile={isMobile}
          />
        ) : (
          <MobileToolbarContent
            type={mobileView === "highlighter" ? "highlighter" : "link"}
            onBack={() => setMobileView("main")}
          />
        )}
      </div>
    </Toolbar>
  );
});
