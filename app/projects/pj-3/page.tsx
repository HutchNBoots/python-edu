import { getProjectContent } from "@/lib/projectContent";
import ProjectShell from "@/components/ProjectShell";

export default function ProjectPage() {
  const content = getProjectContent("pj-3");
  return <ProjectShell projectId="pj-3" content={content} />;
}
