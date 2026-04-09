import { getProjectContent } from "@/lib/projectContent";
import ProjectShell from "@/components/ProjectShell";

export default function ProjectPage() {
  const content = getProjectContent("pj-2");
  return <ProjectShell projectId="pj-2" content={content} />;
}
