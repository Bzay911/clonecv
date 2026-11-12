import type { Basics } from "../../types/types";
import { Field, Section, type FormProps } from "./fields";

export default function BasicsForm({ content, onChange }: FormProps) {
  const basics = content.basics ?? {};

  // Change some fields of basics, keeping every other field (and every other section) as it is
  const updateBasics = (changes: Basics) => {
    onChange({ ...content, basics: { ...basics, ...changes } });
  };

  return (
    <Section title="Personal Information">
      <Field
        label="Full name"
        value={basics.fullName ?? ""}
        onChangeText={(fullName) => updateBasics({ fullName })}
      />
      <Field
        label="Headline"
        value={basics.headline ?? ""}
        onChangeText={(headline) => updateBasics({ headline })}
      />
      <Field
        label="Email"
        value={basics.email ?? ""}
        onChangeText={(email) => updateBasics({ email })}
      />
      <Field
        label="Phone"
        value={basics.phone ?? ""}
        onChangeText={(phone) => updateBasics({ phone })}
      />
      <Field
        label="Location"
        value={basics.location ?? ""}
        onChangeText={(location) => updateBasics({ location })}
        placeholder="Melbourne, VIC"
      />
      <Field
        label="Summary"
        value={basics.summary ?? ""}
        onChangeText={(summary) => updateBasics({ summary })}
        multiline
      />
    </Section>
  );
}
