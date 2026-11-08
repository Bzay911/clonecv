import type { Experience } from "../../types";
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

export default function ExperienceForm({ content, onChange }: FormProps) {
  const experiences = content.experiences ?? [];

  // Change some fields of role number `index`
  const updateRole = (index: number, changes: Experience) => {
    const updated = experiences.map((job, i) =>
      i === index ? { ...job, ...changes } : job,
    );
    onChange({ ...content, experiences: updated });
  };

  // Add an empty role at the end
  const addRole = () => {
    onChange({ ...content, experiences: [...experiences, {}] });
  };

  // Remove role number `index`
  const removeRole = (index: number) => {
    onChange({
      ...content,
      experiences: experiences.filter((_, i) => i !== index),
    });
  };

  return (
    <Section title="Experience">
      {experiences.map((job, i) => (
        <Card key={i}>
          <CardHeader
            title={job.role || "New role"}
            onRemove={() => confirmRemove("role", () => removeRole(i))}
          />
          <Field
            label="Role"
            value={job.role ?? ""}
            onChangeText={(role) => updateRole(i, { role })}
          />
          <Field
            label="Company"
            value={job.company ?? ""}
            onChangeText={(company) => updateRole(i, { company })}
          />
          <Field
            label="Location"
            value={job.location ?? ""}
            onChangeText={(location) => updateRole(i, { location })}
            placeholder="Perth, WA"
          />
          <Field
            label="Dates"
            value={job.dates ?? ""}
            onChangeText={(dates) => updateRole(i, { dates })}
            placeholder="Feb 2025 – Present"
          />
          <Field
            label="Highlights, one per line"
            value={toLines(job.highlights)}
            onChangeText={(text) =>
              updateRole(i, { highlights: fromLines(text) })
            }
            multiline
          />
        </Card>
      ))}
      <AddButton label="Add a role" onPress={addRole} />
    </Section>
  );
}
