import type { Project } from "../../types/types";
import {
    AddButton,
    Card,
    CardHeader,
    confirmRemove,
    Field,
    Section,
    type FormProps,
} from "./fields";

export default function ProjectsForm({ content, onChange }: FormProps) {
  const projects = content.projects ?? [];

  // Change some fields of project number `index`
  const updateProject = (index: number, changes: Project) => {
    const updated = projects.map((project, i) =>
      i === index ? { ...project, ...changes } : project,
    );
    onChange({ ...content, projects: updated });
  };

  // Add an empty project at the end
  const addProject = () => {
    onChange({ ...content, projects: [...projects, {}] });
  };

  // Remove project number `index`
  const removeProject = (index: number) => {
    onChange({ ...content, projects: projects.filter((_, i) => i !== index) });
  };

  return (
    <Section title="Projects">
      {projects.map((project, i) => (
        <Card key={i}>
          <CardHeader
            title={project.name || "New project"}
            onRemove={() => confirmRemove("project", () => removeProject(i))}
          />
          <Field
            label="Name"
            value={project.name ?? ""}
            onChangeText={(name) => updateProject(i, { name })}
          />
          <Field
            label="Link"
            value={project.url ?? ""}
            onChangeText={(url) => updateProject(i, { url })}
            placeholder="github.com/you/project"
          />
          <Field
            label="Description"
            value={project.description ?? ""}
            onChangeText={(description) => updateProject(i, { description })}
            multiline
          />
        </Card>
      ))}
      <AddButton label="Add project" onPress={addProject} />
    </Section>
  );
}
