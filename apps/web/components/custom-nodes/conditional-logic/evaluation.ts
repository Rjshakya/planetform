import { Condition } from "./node";

export const evaluateCondition = (
  condition: Condition,
  fieldValue: any
): boolean => {
  const { operator, value } = condition;

  // Handle empty/null values
  if (fieldValue === null || fieldValue === undefined) {
    return operator === "is_empty";
  }

  // Convert to string for comparison if needed
  const stringValue = String(fieldValue);
  const compareValue = String(value);
  console.log(stringValue);
  console.log(compareValue);

  switch (operator) {
    case "equals":
      return stringValue === compareValue;

    case "not_equals":
      return stringValue !== compareValue;

    case "contains":
      return stringValue.toLowerCase().includes(compareValue.toLowerCase());

    case "greater_than":
      // Try numeric comparison first, fall back to string
      const numField = parseFloat(stringValue);
      const numCompare = parseFloat(compareValue);
      if (!isNaN(numField) && !isNaN(numCompare)) {
        return numField > numCompare;
      }
      return stringValue > compareValue;

    case "less_than":
      const numField2 = parseFloat(stringValue);
      const numCompare2 = parseFloat(compareValue);
      if (!isNaN(numField2) && !isNaN(numCompare2)) {
        return numField2 < numCompare2;
      }
      return stringValue < compareValue;

    case "is_empty":
      return stringValue.trim() === "";

    case "is_not_empty":
      return stringValue.trim() !== "";

    default:
      return false;
  }
};

export const evaluateConditions = (
  conditions: Condition[] = [],
  formValues: Record<string, any>,
  logicOperator: "AND" | "OR"
): boolean => {
  if (conditions.length === 0) return true;

  const results = conditions.map?.((condition) => {
    const fieldValue = formValues[condition.fieldId];
    return evaluateCondition(condition, fieldValue);
  })

  if (logicOperator === "AND") {
    return results?.every?.((result) => result);
  } else {
    return results.some((result) => result);
  }
};

export const getConditionalVisibility = (
  fieldId: string,
  conditionalLogicNodes: any[],
  formValues: Record<string, any>
): boolean => {
  // Default to visible if no conditional logic affects this field
  let isVisible = true;

  for (const logicNode of conditionalLogicNodes) {
    const { conditions, targetFieldIds, logicOperator, action } =
      logicNode.attrs;

    // Check if this field is affected by this logic node
    if (targetFieldIds.includes(fieldId)) {
      const conditionsMet = evaluateConditions(
        conditions,
        formValues,
        logicOperator
      );

      if (action === "show") {
        // Show only when conditions are met
        isVisible = conditionsMet;
      } else if (action === "hide") {
        // Hide when conditions are met (show when not met)
        isVisible = !conditionsMet;
      }

      // If this field is hidden by any logic, it should be hidden
      if (!isVisible) {
        break;
      }
    }
  }

  return isVisible;
};
