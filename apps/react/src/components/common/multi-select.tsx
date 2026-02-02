import { Label } from "@/components/ui/label";
import MultipleSelector, {
  type MultipleSelectorProps,
} from "@/components/ui/multiselect";

export default function MultiSelect(
  props: MultipleSelectorProps & { label: string },
) {
  return (
    <div className="*:not-first:mt-2">
      <Label>Multiselect</Label>
      <MultipleSelector
        // commandProps={{
        //   label: "Select frameworks",
        // }}
        // defaultOptions={frameworks}
        // emptyIndicator={<p className="text-center text-sm">No results found</p>}
        // hideClearAllButton
        // hidePlaceholderWhenSelected
        // placeholder="Select frameworks"
        // value={frameworks.slice(0, 2)}
        {...props}
      />
    </div>
  );
}
