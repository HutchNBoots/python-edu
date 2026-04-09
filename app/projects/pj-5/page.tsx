import { getProjectContent } from "@/lib/projectContent";
import ProjectShell from "@/components/ProjectShell";

export default function ProjectPage() {
  const content = getProjectContent("pj-5");
  return <ProjectShell projectId="pj-5" content={content} />;
}
