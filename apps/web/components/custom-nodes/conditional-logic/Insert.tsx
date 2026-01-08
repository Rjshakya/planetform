"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentEditor } from "@tiptap/react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Condition } from "./node";

interface InsertConditionalLogicProps {
  setOpen: (open: boolean) => void;
  initialData?: any;
  onSave?: (data: any) => void;
  mode?: "create" | "edit";
}

export const InsertConditionalLogic = ({
  setOpen,
  initialData,
  onSave,
  mode = "create",
}: InsertConditionalLogicProps) => {
  const { editor } = useCurrentEditor();
  const [conditions, setConditions] = useState<Condition[]>(
    initialData?.conditions || []
  );
  const [targetFieldIds, setTargetFieldIds] = useState<string[]>(
    initialData?.targetFieldIds || []
  );
  const [logicOperator, setLogicOperator] = useState<"AND" | "OR">(
    initialData?.logicOperator || "AND"
  );
  const [action, setAction] = useState<"show" | "hide">(
    initialData?.action || "show"
  );

  // Get all available form fields from the editor content
  const getAvailableFields = () => {
    if (!editor) return [];

    const fields: Array<{
      id: string;
      label: string;
      type: string;
      content: string | undefined;
    }> = [];

    editor.state.doc.descendants((node) => {
      if (
        node.type.name !== "conditionalLogic" &&
        node.type.name !== "optionNode"
      ) {
        const attrs = node.attrs;

        if (attrs.id && attrs.label) {
          fields.push({
            id: attrs.id,
            label: attrs.label || `Field ${attrs.id.slice(0, 8)}`,
            type: node.type.name,
            content: node.content.content[0].text,
          });
        }
      }
    });

    return fields;
  };

  const availableFields = getAvailableFields();

  const addCondition = () => {
    const newCondition: Condition = {
      id: uuidv4(),
      fieldId: "",
      operator: "equals",
      value: "",
    };
    setConditions([...conditions, newCondition]);
  };

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    setConditions(
      conditions.map((cond) =>
        cond.id === id ? { ...cond, ...updates } : cond
      )
    );
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((cond) => cond.id !== id));
  };

  const toggleTargetField = (fieldId: string) => {
    setTargetFieldIds((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleInsert = () => {
    if (conditions.length === 0 || targetFieldIds.length === 0) {
      return;
    }

    if (mode === "edit" && onSave) {
      onSave({
        conditions,
        targetFieldIds,
        logicOperator,
        action,
      });
    } else {
      editor?.commands?.insertConditionalLogic({
        id: uuidv4(),
        conditions,
        targetFieldIds,
        logicOperator,
        action,
      });

      setConditions([]);
      setTargetFieldIds([]);
      setLogicOperator("AND");
      setAction("show");
    }
    setOpen(false);
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

  return (
    <div className=" ">
      <DialogTitle>
        {mode === "edit"
          ? "Edit Conditional Logic"
          : "Configure Conditional Logic"}
      </DialogTitle>
      <div
        className="space-y-6 max-h-[70vh] overflow-y-auto grid gap-4 mt-8"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Action Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Action</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={action === "show" ? "default" : "outline"}
              size="sm"
              onClick={() => setAction("show")}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Show fields
            </Button>
            <Button
              type="button"
              variant={action === "hide" ? "default" : "outline"}
              size="sm"
              onClick={() => setAction("hide")}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Hide fields
            </Button>
          </div>
        </div>

        {/* Target Fields Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Target Fields</Label>
          <div className="text-sm text-muted-foreground mb-2">
            Select which fields to {action} when conditions are met:
          </div>
          <div
            className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-4"
            style={{ scrollbarWidth: "none" }}
          >
            {availableFields.map((field) => (
              <div
                key={field.id}
                className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                  targetFieldIds.includes(field.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent"
                }`}
                onClick={() => toggleTargetField(field.id)}
              >
                <input
                  type="checkbox"
                  checked={targetFieldIds.includes(field.id)}
                  onChange={() => toggleTargetField(field.id)}
                  className="rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {field.content || field.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {field.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {availableFields.length === 0 && (
            <div className="text-sm text-muted-foreground italic">
              No form fields available. Add some fields first.
            </div>
          )}
        </div>

        {/* Conditions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Conditions</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCondition}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Condition
            </Button>
          </div>

          {conditions.length > 1 && (
            <div className="flex items-center gap-2">
              <Label className="text-sm">Logic:</Label>
              <Select
                value={logicOperator}
                onValueChange={(value: "AND" | "OR") => setLogicOperator(value)}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            {conditions.map?.((condition, index) => (
              <Card key={condition.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      <div className=" col-span-2">
                        <Label className="text-xs">Field</Label>
                        <Select
                          value={condition.fieldId}
                          onValueChange={(value) =>
                            updateCondition(condition.id, { fieldId: value })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFields.map((field) => (
                              <SelectItem key={field.id} value={field.id}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Operator</Label>
                        <Select
                          value={condition.operator}
                          onValueChange={(value: any) =>
                            updateCondition(condition.id, { operator: value })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">equals</SelectItem>
                            <SelectItem value="not_equals">
                              does not equal
                            </SelectItem>
                            <SelectItem value="contains">contains</SelectItem>
                            <SelectItem value="greater_than">
                              is greater than
                            </SelectItem>
                            <SelectItem value="less_than">
                              is less than
                            </SelectItem>
                            <SelectItem value="is_empty">is empty</SelectItem>
                            <SelectItem value="is_not_empty">
                              is not empty
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {condition.operator !== "is_empty" &&
                        condition.operator !== "is_not_empty" && (
                          <div>
                            <Label className="text-xs">Value</Label>
                            <Input
                              value={condition.value}
                              onChange={(e) =>
                                updateCondition(condition.id, {
                                  value: e.target.value,
                                })
                              }
                              placeholder="Enter value"
                              className="h-8"
                            />
                          </div>
                        )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Preview:{" "}
                      {condition.fieldId
                        ? `${availableFields.find((f) => f.id === condition.fieldId)?.label || "Field"} ${getOperatorLabel(condition.operator)}${condition.operator !== "is_empty" && condition.operator !== "is_not_empty" ? ` "${condition.value}"` : ""}`
                        : "Select a field"}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(condition.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {conditions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-sm">No conditions added yet.</div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCondition}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first condition
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleInsert}
            disabled={conditions.length === 0 || targetFieldIds.length === 0}
          >
            {mode === "edit" ? "Save Changes" : "Insert Logic"}
          </Button>
        </div>
      </div>
    </div>
  );
};
