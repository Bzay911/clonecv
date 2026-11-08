import type { Skill } from "../../types";
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

/** How the form shows skills: one card per category. */
type Group = { category: string; names: string[] };

// Server list → groups
// [{name:"Expo",category:"Mobile"},{name:"Git"}]  →  [{category:"Mobile",names:["Expo"]},{category:"",names:["Git"]}]
function toGroups(skills: Skill[]): Group[] {
  const groups: Group[] = [];
  for (const skill of skills) {
    const category = skill.category ?? "";
    let group = groups.find((g) => g.category === category);
    if (!group) {
      group = { category, names: [] };
      groups.push(group);
    }
    group.names.push(skill.name);
  }
  return groups;
}

// Groups → server list (the reverse of toGroups)
function fromGroups(groups: Group[]): Skill[] {
  const skills: Skill[] = [];
  for (const group of groups) {
    for (const name of group.names) {
      skills.push(
        group.category ? { name, category: group.category } : { name },
      );
    }
  }
  return skills;
}

export default function SkillsForm({ content, onChange }: FormProps) {
  const groups = toGroups(content.skills ?? []);

  // Every change rebuilds the flat skills list from the groups
  const saveGroups = (updated: Group[]) => {
    onChange({ ...content, skills: fromGroups(updated) });
  };

  // Change the category or skills of group number `index`
  const updateGroup = (index: number, changes: Partial<Group>) => {
    saveGroups(
      groups.map((group, i) =>
        i === index ? { ...group, ...changes } : group,
      ),
    );
  };

  const addGroup = () => {
    saveGroups([...groups, { category: "New group", names: [""] }]);
  };

  const removeGroup = (index: number) => {
    saveGroups(groups.filter((_, i) => i !== index));
  };

  return (
    <Section title="Skills">
      {groups.map((group, i) => (
        <Card key={i}>
          <CardHeader
            title={group.category || "Skills"}
            onRemove={() => confirmRemove("skill group", () => removeGroup(i))}
          />
          <Field
            label="Category"
            value={group.category}
            onChangeText={(category) => updateGroup(i, { category })}
            placeholder="e.g. Mobile Development"
          />
          <Field
            label="Skills, one per line"
            value={toLines(group.names)}
            onChangeText={(text) => updateGroup(i, { names: fromLines(text) })}
            multiline
          />
        </Card>
      ))}
      <AddButton label="Add skill group" onPress={addGroup} />
    </Section>
  );
}
