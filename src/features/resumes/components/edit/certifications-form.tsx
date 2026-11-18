import {
  AddButton,
  Card,
  CardHeader,
  confirmRemove,
  Field,
  Section,
  type FormProps,
} from "./fields";
import type { Certification } from "../../types/types";

export default function CertificationsForm({ content, onChange }: FormProps) {
  const certifications = content.certifications ?? [];

  // Change some fields of entry number `index`
  const updateCertification = (index: number, changes: Certification) => {
    const updated = certifications.map((item, i) =>
      i === index ? { ...item, ...changes } : item,
    );
    onChange({ ...content, certifications: updated });
  };

  // Add an empty entry at the end
  const addCertification = () => {
    onChange({ ...content, certifications: [...certifications, {}] });
  };

  // Remove entry number `index`
  const removeCertification = (index: number) => {
    onChange({
      ...content,
      certifications: certifications.filter((_, i) => i !== index),
    });
  };

  return (
    <Section title="Certifications">
      {certifications.map((item, i) => (
        <Card key={i}>
          <CardHeader
            title={item.name || "New certification"}
            onRemove={() =>
              confirmRemove("certification", () => removeCertification(i))
            }
          />
          <Field
            label="Name"
            value={item.name ?? ""}
            onChangeText={(name) => updateCertification(i, { name })}
          />
          <Field
            label="Issuer"
            value={item.issuer ?? ""}
            onChangeText={(issuer) => updateCertification(i, { issuer })}
          />
          <Field
            label="Date"
            value={item.date ?? ""}
            onChangeText={(date) => updateCertification(i, { date })}
            placeholder="2022 – 2025"
          />
        </Card>
      ))}
      <AddButton label="Add certification" onPress={addCertification} />
    </Section>
  );
}
