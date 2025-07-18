import MyWorkspace from "@/features/projects/components/projects";

const Projects = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="container mx-auto my-6 flex-1 overflow-auto">
        {" "}
        <div className="flex justify-between gap-4 items-start mb-6 sm:flex-row flex-col md:items-center md:gap-0">
          <h1 className="text-2xl font-semibold">My Workspace</h1>
        </div>
        <MyWorkspace />
      </div>
    </div>
  );
};

export default Projects;
