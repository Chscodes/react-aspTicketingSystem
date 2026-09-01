import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageHeader, PageShell } from "../../../shared/components/layout/PageShell";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import { Card, CardHeader } from "../../../shared/components/ui/Card";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { Spinner } from "../../../shared/components/ui/Spinner";
import { useProjects } from "../hooks/useProjects";

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();

  return (
    <PageShell>
      <PageHeader
        title="Projects"
        description="Select a project to manage its tickets"
        actions={
          <Button variant="secondary" disabled>
            + Add project
          </Button>
        }
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100"
        >
          {error}
        </motion.div>
      )}

      <Card>
        <CardHeader
          title="All projects"
          description="Active projects in your workspace"
          action={
            !loading && (
              <Badge className="bg-zinc-50 text-zinc-600 ring-zinc-200">
                {projects.length} {projects.length === 1 ? "project" : "projects"}
              </Badge>
            )
          }
        />

        {loading ? (
          <div className="py-16">
            <Spinner />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Projects will appear here once they are created."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Remarks</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <motion.tbody
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-zinc-100"
              >
                {projects.map((project) => (
                  <motion.tr
                    key={project.id}
                    variants={rowVariants}
                    className="group transition-colors hover:bg-zinc-50/80"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-zinc-900">
                        {project.project_name}
                      </span>
                    </td>
                    <td className="max-w-md px-6 py-4 text-zinc-500">
                      {project.remarks || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          project.isDeleted
                            ? "bg-rose-50 text-rose-700 ring-rose-200"
                            : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        }
                      >
                        {project.isDeleted ? "Deleted" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          navigate(`/projects/${project.id}/tickets`)
                        }
                      >
                        View tickets
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </Card>
    </PageShell>
  );
}
