import { Label } from "@/components/ui/label";
import MultipleSelector, {
  type MultipleSelectorProps,
} from "@/components/ui/multiselect";

export default function MultiSelect(
  props: MultipleSelectorProps & { label: string },
) {
  return (
    <div className="*:not-first:mt-2">
      <Label>{props.label}</Label>
      <MultipleSelector {...props} />
    </div>
  );
}
