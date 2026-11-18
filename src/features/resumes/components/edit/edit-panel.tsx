import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import type { SaveStatus } from "../../lib/use-autosave";
import BasicsForm from "./basics-form";
import EducationForm from "./education-form";
import ExperienceForm from "./experience-form";
import {type FormProps } from "./fields";
import ProjectsForm from "./projects-form";
import SkillsForm from "./skills-form";
import SaveIndicator from "../../lib/save-indicator";
import CertificationsForm from "./certifications-form";
import ReferencesForm from "./references-form";
import CustomSectionsForm from "./custom-sections-form";

type EditPanelProps = FormProps & {
  saveStatus: SaveStatus;
  onRetry: () => void;
};

export default function EditPanel({
  content,
  onChange,
  saveStatus,
  onRetry,
}: EditPanelProps) {
  return (
    <BottomSheetScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        gap: 24,
        paddingHorizontal: 16,
        paddingBottom: 60,
      }}
    >
      <SaveIndicator status={saveStatus} onRetry={onRetry} />
      <BasicsForm content={content} onChange={onChange} />
      <ExperienceForm content={content} onChange={onChange} />
      <SkillsForm content={content} onChange={onChange} />
      <EducationForm content={content} onChange={onChange} />
      <ProjectsForm content={content} onChange={onChange} />
      <CertificationsForm content={content} onChange={onChange} />
      <ReferencesForm content={content} onChange={onChange} />
      <CustomSectionsForm content={content} onChange={onChange} />
    </BottomSheetScrollView>
  );
}
