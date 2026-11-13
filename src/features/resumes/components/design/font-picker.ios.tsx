import { Host, Picker, Text } from "@expo/ui/swift-ui";
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";

import { FONT_FAMILIES } from "./design-constants";
import type { Font, FontPickerProps } from "./font-picker";

export default function FontPicker({ value, onChange }: FontPickerProps) {
  return (
    <Host matchContents style={{ alignSelf: "flex-start" }}>
      <Picker
        modifiers={[pickerStyle("menu")]}
        label="Font"
        selection={value}
        onSelectionChange={(selection) => onChange(selection as Font)}
      >
        {FONT_FAMILIES.map((f) => (
          <Text key={f} modifiers={[tag(f)]}>
            {f}
          </Text>
        ))}
      </Picker>
    </Host>
  );
}