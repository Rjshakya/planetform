"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Card, CardContent } from "./ui/card";
import { InsertShortInput } from "./custom-nodes/shortinput/Insert";
import { InsertLongInput } from "./custom-nodes/longinput/Insert";
import { InsertMultipleChoice } from "./custom-nodes/multiple-choices/Insert";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { InsertPhoneInput } from "./custom-nodes/phoneinput/Insert";
import { InsertDateInput } from "./custom-nodes/date-input/Insert";
import { InsertConditionalLogic } from "./custom-nodes/conditional-logic/Insert";

import { ChevronDown, TextCursorInput } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const CustomInputsDropdown = () => {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState("");

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"sm"}>
                {/* <TextCursorInput /> */}
                Fields
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Input fields</TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="start" className=" rounded-sm grid p-1">
          {/* <Card className="py-1 border-0 shadow-none">
            <CardContent className="px-1 grid gap-1"> */}
          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
              setDialog("short");
            }}
          >
            Short Input
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
              setDialog("long");
            }}
          >
            Long Input
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
              setDialog("multiple");
            }}
          >
            Multiple choice
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
              setDialog("Date");
            }}
          >
            Date input
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
              setDialog("conditional");
            }}
          >
            Conditional Logic
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <InsertPhoneInput />
          </DropdownMenuItem>

          {/* </CardContent>
          </Card> */}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {dialog === "multiple" && <InsertMultipleChoice setOpen={setOpen} />}
          {dialog === "short" && <InsertShortInput setOpen={setOpen} />}
          {dialog === "long" && <InsertLongInput setOpen={setOpen} />}
          {dialog === "Date" && <InsertDateInput setOpen={setOpen} />}
          {dialog === "conditional" && (
            <InsertConditionalLogic setOpen={setOpen} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
