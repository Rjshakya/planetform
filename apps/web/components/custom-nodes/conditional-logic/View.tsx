"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, GitBranch, Settings } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InsertConditionalLogic } from "./Insert";

const ConditionalLogicView = (props: NodeViewProps) => {
  const { conditions, targetFieldIds, logicOperator, action } =
    props.node.attrs;
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getAvailableFields = () => {
    if (!props.editor) return [];

    const fields: Array<{ id: string; label: string; type: string }> = [];

    props.editor.state.doc.descendants((node) => {
      if (
        node.type.name !== "conditionalLogic" &&
        node.attrs.id &&
        node.attrs.label
      ) {
        fields.push({
          id: node.attrs.id,
          label: node.attrs.label || `Field ${node.attrs.id.slice(0, 8)}`,
          type: node.type.name,
        });
      }
    });

    return fields;
  };

  const availableFields = getAvailableFields();

  const getFieldLabel = (fieldId: string) => {
    const field = availableFields.find((f) => f.id === fieldId);
    return field ? field.label : `Field ${fieldId.slice(0, 8)}...`;
  };

  const getOperatorLabel = (operator: string) => {
    switch (operator) {
      case "equals":
        return "equals";
      case "not_equals":
        return "does not equal";
      case "contains":
        return "contains";
      case "greater_than":
        return "is greater than";
      case "less_than":
        return "is less than";
      case "is_empty":
        return "is empty";
      case "is_not_empty":
        return "is not empty";
      default:
        return operator;
    }
  };

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleSave = (updatedAttrs: any) => {
    props.updateAttributes(updatedAttrs);
    setShowEditDialog(false);
  };

  return (
    <NodeViewWrapper
      as={"div"}
      className={`${props.editor?.isEditable || "hidden"}`}
    >
      <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 hover:border-blue-300 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <GitBranch className="h-4 w-4 text-blue-600" />
              Conditional Logic
              <Badge variant="secondary" className="text-xs">
                {action === "show" ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Show
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hide
                  </>
                )}
              </Badge>
            </CardTitle>
            {props.editor?.isEditable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                type="button"
              >
                <Settings className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="text-muted-foreground">
              <strong>If</strong>{" "}
              {conditions.length > 0 ? conditions.length : "no"} condition
              {conditions.length !== 1 ? "s" : ""} are met:
            </div>

            {conditions.length > 0 ? (
              <div className="space-y-1">
                {conditions.map?.((condition: any, index: number) => (
                  <div
                    key={condition.id || index}
                    className="flex items-center gap-2 text-xs"
                  >
                    {conditions.length > 1 && index > 0 && (
                      <span className="text-muted-foreground font-medium">
                        {logicOperator}
                      </span>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {getFieldLabel(condition.fieldId)}
                    </Badge>
                    <span className="text-muted-foreground">
                      {getOperatorLabel(condition.operator)}
                    </span>
                    {condition.operator !== "is_empty" &&
                      condition.operator !== "is_not_empty" && (
                        <Badge variant="outline" className="text-xs">
                          {condition.value}
                        </Badge>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-xs italic">
                No conditions set
              </div>
            )}

            <div className="text-muted-foreground">
              <strong>Then {action}</strong> {targetFieldIds.length} field
              {targetFieldIds.length !== 1 ? "s" : ""}.
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <InsertConditionalLogic
            setOpen={setShowEditDialog}
            initialData={props.node.attrs}
            onSave={handleSave}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
    </NodeViewWrapper>
  );
};

export default ConditionalLogicView;
