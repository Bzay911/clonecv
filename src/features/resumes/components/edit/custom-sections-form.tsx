import type { CustomSection } from "../../types/types";
import {
  AddButton,
  Card,
  CardHeader,
  confirmRemove,
  Field,
  fromLines,
  Section,
  toLines,
  type FormProps,
} from "./fields";

export default function CustomSectionsForm({ content, onChange }: FormProps) {
  const sections = content.customSections ?? [];

  const updateSection = (id: string, changes: Partial<CustomSection>) => {
    const updated = sections.map((section) =>
      section.id === id ? { ...section, ...changes } : section,
    );
    onChange({ ...content, customSections: updated });
  };

  const addSection = () => {
    const id = `section-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    onChange({
      ...content,
      customSections: [...sections, { id, title: "Untitled section", highlights: [] }],
    });
  };

  const removeSection = (id: string) => {
    onChange({
      ...content,
      customSections: sections.filter((section) => section.id !== id),
    });
  };

  return (
    <Section title="Custom sections">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader
            title={section.title || "Untitled section"}
            onRemove={() =>
              confirmRemove("custom section", () => removeSection(section.id))
            }
          />
          <Field
            label="Title"
            value={section.title}
            onChangeText={(title) => updateSection(section.id, { title })}
            placeholder="Volunteering"
          />
          <Field
            label="Bullet points (one per line)"
            value={toLines(section.highlights)}
            onChangeText={(text) =>
              updateSection(section.id, { highlights: fromLines(text) })
            }
            multiline
          />
        </Card>
      ))}
      <AddButton label="Add custom section" onPress={addSection} />
    </Section>
  );
}
