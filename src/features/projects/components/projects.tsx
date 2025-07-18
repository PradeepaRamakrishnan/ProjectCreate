import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  BarChart as ChartNetwork,
  MoreHorizontal,
  Users,
  Loader2,
  Archive,
  Globe,
  Lock,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal as MoreHorizontalIcon,
  Plus,
  ArchiveRestore,
  Trash2,
  Edit,
  Share2,
  Clock,
  Loader2 as LoaderIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import slugify from "slugify";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/contexts/AuthContext";

interface Project {
  id: string;
  name: string;
  description: string;
  visibility: "private" | "team" | "public";
  created_at: string;
  updated_at: string;
  user_id: string;
  team_id?: string;
  archived: boolean;
  files: Json;
  isTeamMember?: boolean;
  userRole?: string;
  status?: "queued" | "retrieving" | "processing" | "completed" | "failed";
}

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

const fetchProjects = async (userId: string, userEmail: string) => {
  // Fetch projects where user is the owner
  const { data: ownedProjects, error: ownedError } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (ownedError) throw ownedError;

  // Get IDs of owned projects to filter out duplicates
  const ownedProjectIds = new Set(
    (ownedProjects || []).map((project) => project.id)
  );

  // Combine both sets of projects
  const allProjects = [
    ...(ownedProjects || []).map((project) => ({
      ...project,
      visibility: project.visibility as "private" | "team" | "public",
      isTeamMember: false,
      archived: project.archived || false,
    })),
  ] as Project[];

  return allProjects;
};

const MyWorkspace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);
  const [accessDeniedProject, setAccessDeniedProject] =
    useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showArchived, setShowArchived] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const location = useLocation();

  // Get active tab from URL search params or default to "projects"
  const [activeTab, setActiveTab] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("tab");
    return tabFromUrl === "agents" ? "agents" : "projects";
  });

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newSearchParams = new URLSearchParams(location.search);
    if (value === "agents") {
      newSearchParams.set("tab", "agents");
    } else {
      newSearchParams.delete("tab");
    }

    const newUrl = `${location.pathname}${
      newSearchParams.toString() ? "?" + newSearchParams.toString() : ""
    }`;
    window.history.replaceState(null, "", newUrl);
  };

  // Update active tab when URL changes (e.g., when navigating back)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("tab");
    const newActiveTab = tabFromUrl === "agents" ? "agents" : "projects";
    setActiveTab(newActiveTab);
  }, [location.search]);

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: () => fetchProjects(user!.id, user!.email!),
    enabled: !!user && !!user.email,
  });

  // Set up real-time subscription for project status updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "projects",
        },
        (payload) => {
          const updatedProject = payload.new as Project;

          // Update the specific project in the cache if it exists in user's projects
          queryClient.setQueryData(
            ["projects", user.id],
            (oldData: Project[] | undefined) => {
              if (!oldData) return oldData;

              // Check if this project exists in the user's current projects list
              const projectExists = oldData.some(
                (p) => p.id === updatedProject.id
              );
              if (projectExists) {
                return oldData.map((project) =>
                  project.id === updatedProject.id
                    ? { ...project, ...updatedProject }
                    : project
                );
              }
              return oldData;
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const archiveMutation = useMutation({
    mutationFn: async ({
      projectId,
      archived,
    }: {
      projectId: string;
      archived: boolean;
    }) => {
      const { error } = await supabase
        .from("projects")
        .update({ archived, updated_at: new Date().toISOString() })
        .eq("id", projectId);

      if (error) throw error;

      // Track archive/unarchive activity
      const project = projects.find((p) => p.id === projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (projectId: string) => {
      // Get project details before deletion for activity tracking
      const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      const { error: docError } = await supabase
        .from("documents")
        .delete()
        .eq("project_id", projectId);

      if (docError) throw docError;

      // Track project deletion activity
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    },
  });

  const handleProjectClick = (project: Project) => {
    if (project.status === "queued" || project.status === "retrieving") {
      toast.warning("Project is still being processed. Please wait.", {
        id: "project-processing-warning",
      });
      return;
    }
    const slug = slugify(project.name, { lower: true, strict: true });
    navigate(`/knowledge-graph/${slug}/${project.id}`);
  };

  const handleArchiveProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    archiveMutation.mutate({ projectId, archived: true });
  };

  const handleUnarchiveProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    archiveMutation.mutate({ projectId, archived: false });
  };

  const handleDeleteProject = (projectId: string) => {
    deleteMutation.mutate(projectId);
    setDeleteDialogOpen(false);
  };

  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if it's a team project and user doesn't have editor access
    if (
      project.isTeamMember &&
      project.userRole !== "editor" &&
      project.userRole !== "admin"
    ) {
      setAccessDeniedProject(project);
      setAccessDeniedOpen(true);
      return;
    }

    // Otherwise navigate to edit page
    navigate(`/edit-project/${project.id}`);
  };

  const handleShareGraph = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = slugify(project.name, { lower: true, strict: true });
    const url = `${window.location.origin}/knowledge-graph/${slug}/${project.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  const getFilteredProjects = (projects: Project[], query: string) => {
    if (!query.trim()) return projects;
    const lowercaseQuery = query.toLowerCase().trim();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(lowercaseQuery) ||
        project.description.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getPaginatedProjects = (projects: Project[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return projects.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const renderPageButtons = () => {
      const buttons = [];

      // Always show first page
      buttons.push(
        <Button
          key="page-1"
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className={`w-9 h-9 p-0 ${
            currentPage === 1 ? "bg-purple-600 hover:bg-purple-700" : ""
          }`}
        >
          1
        </Button>
      );

      // If there are many pages, use ellipsis
      if (totalPages > 7) {
        // Show ellipsis after page 1 if current page is far enough
        if (currentPage > 3) {
          buttons.push(
            <Button
              key="ellipsis-1"
              variant="outline"
              size="sm"
              disabled
              className="w-9 h-9 p-0"
            >
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          );
        }

        // Pages around current page
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Adjust if we're at the beginning
        if (currentPage <= 3) {
          endPage = Math.min(totalPages - 1, 4);
        }

        // Adjust if we're at the end
        if (currentPage >= totalPages - 2) {
          startPage = Math.max(2, totalPages - 3);
        }

        // Render the pages
        for (let i = startPage; i <= endPage; i++) {
          buttons.push(
            <Button
              key={`page-${i}`}
              variant={currentPage === i ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i)}
              className={`w-9 h-9 p-0 ${
                currentPage === i ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
            >
              {i}
            </Button>
          );
        }

        // Show ellipsis before last page if needed
        if (currentPage < totalPages - 2) {
          buttons.push(
            <Button
              key="ellipsis-2"
              variant="outline"
              size="sm"
              disabled
              className="w-9 h-9 p-0"
            >
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          );
        }
      } else {
        // Show all pages if there are 7 or fewer
        for (let i = 2; i < totalPages; i++) {
          buttons.push(
            <Button
              key={`page-${i}`}
              variant={currentPage === i ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i)}
              className={`w-9 h-9 p-0 ${
                currentPage === i ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
            >
              {i}
            </Button>
          );
        }
      }

      // Always show last page if it exists and is not the only page
      if (totalPages > 1) {
        buttons.push(
          <Button
            key={`page-${totalPages}`}
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            className={`w-9 h-9 p-0 ${
              currentPage === totalPages
                ? "bg-purple-600 hover:bg-purple-700"
                : ""
            }`}
          >
            {totalPages}
          </Button>
        );
      }

      return buttons;
    };

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 px-2">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-3 sm:mb-0">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
          to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          projects
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            {renderPageButtons()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-slate-50">
        <div className="container mx-auto py-6 px-4 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400 mb-4" />
            <p className="text-sm text-slate-500">Loading your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div >
        <div className="container mx-auto py-6 px-4 flex-1 flex items-center justify-center">
         
            <div className="flex items-start gap-2">
              <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error loading workspace
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"}
                </p>
              </div>
            </div>
          
        </div>
      </div>
    );
  }

  const renderProjectCard = (project: Project) => (
    <Card
      key={project.id}
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleProjectClick(project)}
    >
      <CardHeader className="p-0">
        <div className="relative h-40 bg-slate-100">
          {/* Status Badge */}
          {project.status === "queued" && (
            <span className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-medium shadow">
              <Clock className="w-4 h-4" /> Queued
            </span>
          )}
          {project.status === "retrieving" && (
            <span className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium shadow">
              <LoaderIcon className="w-4 h-4 animate-spin" /> Retrieving
            </span>
          )}
          {project.status === "processing" && (
            <span className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium shadow">
              <LoaderIcon className="w-4 h-4 animate-spin" /> Processing
            </span>
          )}
          {project.status === "completed" && (
            <span className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium shadow">
              <CheckCircle className="w-4 h-4" /> Ready
            </span>
          )}
          {project.status === "failed" && (
            <span className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-medium shadow">
              <XCircle className="w-4 h-4" /> Failed
            </span>
          )}
          {/* <GraphThumbnail projectId={project.id} projectName={project.name} /> */}
          {project.isTeamMember && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="bg-white/80 backdrop-blur-sm text-xs font-medium"
              >
                <Users className="h-3 w-3 mr-1" />
                Team Project
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{project.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(project.user_id === user?.id ||
                (project.isTeamMember &&
                  (project.userRole === "editor" ||
                    project.userRole === "admin"))) && (
                <DropdownMenuItem
                  onClick={(e) => handleEditProject(project, e)}
                >
                  Edit
                </DropdownMenuItem>
              )}
              {project.visibility !== "private" && (
                <DropdownMenuItem onClick={(e) => handleShareGraph(project, e)}>
                  Share
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {!project.archived ? (
                <DropdownMenuItem
                  onClick={(e) => handleArchiveProject(project.id, e)}
                >
                  Archive
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={(e) => handleUnarchiveProject(project.id, e)}
                >
                  Unarchive
                </DropdownMenuItem>
              )}
              {project.user_id === user?.id && (
                <DropdownMenuItem
                  onClick={(e) => {
                    setSelectedProjectId(project.id);
                    setDeleteDialogOpen(true);
                    e.stopPropagation();
                  }}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                project.visibility === "private"
                  ? "secondary"
                  : project.visibility === "team"
                  ? "outline"
                  : "default"
              }
              className="h-6"
            >
              {project.visibility === "private" ? (
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Private</span>
                </div>
              ) : project.visibility === "team" ? (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>Team</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>Public</span>
                </div>
              )}
            </Badge>
          </div>
          <span className="text-xs text-slate-400">
            Updated {new Date(project.updated_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const filteredProjects = getFilteredProjects(
    projects.filter((project) =>
      showArchived ? project.archived : !project.archived
    ),
    searchQuery
  );

  // Debug log for filtering

  return (
    <>
      <div >
        <div>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-0">
              <div className="flex items-center mb-4 gap-2">
                <div className="relative mr-4">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-10 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
                <Button
                  variant={!showArchived ? "default" : "outline"}
                  onClick={() => setShowArchived(false)}
                  className="px-4 py-1"
                >
                  Active
                </Button>
                <Button
                  variant={showArchived ? "default" : "outline"}
                  onClick={() => setShowArchived(true)}
                  className="px-4 py-1"
                >
                  Archived
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 shadow-md">
                      <ChartNetwork className="h-10 w-10 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                      {showArchived
                        ? "No Archived Projects"
                        : "No Projects Yet"}
                    </h3>
                    <p className="text-base text-slate-600 text-center max-w-md mb-6">
                      {showArchived
                        ? "Archived projects will appear here."
                        : "Start by creating your first project. Projects help you organize your knowledge graphs and collaborate with your team."}
                    </p>
                    {!showArchived && (
                      <Button
                        size="lg"
                        className="hidden md:flex items-center px-3 py-1.5 rounded-md bg-biotech-purple text-white hover:bg-biotech-purple/90 transition-colors"
                        onClick={() => navigate("/new-graph")}
                      >
                        + Create New Project
                      </Button>
                    )}
                  </div>
                ) : (
                  getPaginatedProjects(filteredProjects).map(renderProjectCard)
                )}
              </div>
              {renderPagination(filteredProjects.length)}
            </TabsContent>
          </Tabs>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    selectedProjectId && handleDeleteProject(selectedProjectId)
                  }
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Access Denied Dialog */}
          <Dialog open={accessDeniedOpen} onOpenChange={setAccessDeniedOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Access Denied
                </DialogTitle>
                <DialogDescription>
                  You don't have permission to edit this team project. Only team
                  members with editor or admin role can edit team projects.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mt-2">
                <p className="text-sm text-amber-800">
                  Project:{" "}
                  <span className="font-medium">
                    {accessDeniedProject?.name}
                  </span>
                </p>
                <p className="text-sm text-amber-800 mt-1">
                  Your role:{" "}
                  <span className="font-medium">
                    {accessDeniedProject?.userRole || "Viewer"}
                  </span>
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => setAccessDeniedOpen(false)}
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>{" "}
    </>
  );
};

export default MyWorkspace;
