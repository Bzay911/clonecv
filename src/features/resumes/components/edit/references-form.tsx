import type { Reference } from "../../types/types";
import {
  AddButton,
  Card,
  CardHeader,
  confirmRemove,
  Field,
  Section,
  type FormProps,
} from "./fields";

export default function ReferencesForm({ content, onChange }: FormProps) {
  const references = content.references ?? [];

  const updateReference = (index: number, changes: Reference) => {
    const updated = references.map((reference, i) =>
      i === index ? { ...reference, ...changes } : reference,
    );
    onChange({ ...content, references: updated });
  };

  const removeReference = (index: number) => {
    onChange({
      ...content,
      references: references.filter((_, i) => i !== index),
    });
  };

  return (
    <Section title="References">
      {references.map((reference, index) => (
        <Card key={index}>
          <CardHeader
            title={reference.name || "New reference"}
            onRemove={() =>
              confirmRemove("reference", () => removeReference(index))
            }
          />
          <Field
            label="Name"
            value={reference.name ?? ""}
            onChangeText={(name) => updateReference(index, { name })}
          />
          <Field
            label="Relationship"
            value={reference.relationship ?? ""}
            onChangeText={(relationship) => updateReference(index, { relationship })}
            placeholder="Former manager"
          />
          <Field
            label="Email"
            value={reference.email ?? ""}
            onChangeText={(email) => updateReference(index, { email })}
          />
          <Field
            label="Phone"
            value={reference.phone ?? ""}
            onChangeText={(phone) => updateReference(index, { phone })}
          />
          <Field
            label="Description"
            value={reference.description ?? ""}
            onChangeText={(description) => updateReference(index, { description })}
            multiline
          />
        </Card>
      ))}
      <AddButton
        label="Add reference"
        onPress={() => onChange({ ...content, references: [...references, {}] })}
      />
    </Section>
  );
}
