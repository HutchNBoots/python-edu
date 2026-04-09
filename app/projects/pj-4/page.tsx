import { getProjectContent } from "@/lib/projectContent";
import ProjectShell from "@/components/ProjectShell";

export default function ProjectPage() {
  const content = getProjectContent("pj-4");
  return <ProjectShell projectId="pj-4" content={content} />;
}
