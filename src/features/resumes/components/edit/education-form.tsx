import type { Education } from "../../types";
import {
  AddButton,
  Card,
  CardHeader,
  confirmRemove,
  Field,
  Section,
  type FormProps,
} from "./fields";

export default function EducationForm({ content, onChange }: FormProps) {
  const education = content.education ?? [];

  // Change some fields of entry number `index`
  const updateEducation = (index: number, changes: Education) => {
    const updated = education.map((item, i) =>
      i === index ? { ...item, ...changes } : item,
    );
    onChange({ ...content, education: updated });
  };

  // Add an empty entry at the end
  const addEducation = () => {
    onChange({ ...content, education: [...education, {}] });
  };

  // Remove entry number `index`
  const removeEducation = (index: number) => {
    onChange({
      ...content,
      education: education.filter((_, i) => i !== index),
    });
  };

  return (
    <Section title="Education">
      {education.map((item, i) => (
        <Card key={i}>
          <CardHeader
            title={item.institution || "New education"}
            onRemove={() =>
              confirmRemove("education", () => removeEducation(i))
            }
          />
          <Field
            label="Institution"
            value={item.institution ?? ""}
            onChangeText={(institution) => updateEducation(i, { institution })}
          />
          <Field
            label="Degree"
            value={item.degree ?? ""}
            onChangeText={(degree) => updateEducation(i, { degree })}
            placeholder="Bachelor's"
          />
          <Field
            label="Field of study"
            value={item.field ?? ""}
            onChangeText={(field) => updateEducation(i, { field })}
          />
          <Field
            label="Dates"
            value={item.dates ?? ""}
            onChangeText={(dates) => updateEducation(i, { dates })}
            placeholder="2022 – 2025"
          />
        </Card>
      ))}
      <AddButton label="Add education" onPress={addEducation} />
    </Section>
  );
}
