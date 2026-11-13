import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { FONT_FAMILIES } from "./design-constants";

export type Font = (typeof FONT_FAMILIES)[number];

export type FontPickerProps = {
  value: string;
  onChange: (font: Font) => void;
};

export default function FontPicker({ value, onChange }: FontPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="h-10 flex-row items-center justify-between rounded-lg bg-[#F2F2F7] px-3.5 dark:bg-[#2C2C2E]"
      >
        <Text className="text-[15px] text-black dark:text-white">{value}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color="#8E8E93"
        />
      </Pressable>

      {open && (
        <View className="mt-1.5 overflow-hidden rounded-lg border border-[#E5E5EA] bg-white dark:border-[#38383A] dark:bg-[#2C2C2E]">
          {FONT_FAMILIES.map((f, i) => (
            <Pressable
              key={f}
              onPress={() => {
                onChange(f);
                setOpen(false);
              }}
              className={`flex-row items-center justify-between px-3.5 py-3 ${
                i > 0 ? "border-t border-[#E5E5EA] dark:border-[#38383A]" : ""
              }`}
            >
              <Text className="text-[15px] text-black dark:text-white">{f}</Text>
              {value === f && (
                <Ionicons name="checkmark" size={18} color="#0A84FF" />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}