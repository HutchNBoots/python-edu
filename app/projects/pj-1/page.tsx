import { getProjectContent } from "@/lib/projectContent";
import ProjectShell from "@/components/ProjectShell";

export default function ProjectPage() {
  const content = getProjectContent("pj-1");
  return <ProjectShell projectId="pj-1" content={content} />;
}
