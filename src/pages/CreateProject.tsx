import { CreateProjectForm } from "@/features/create-project";
import { Helmet } from "react-helmet-async";

const CreateProject = () => {
  return (
    <>
      <Helmet>
        <title>Create Project</title>
        <meta
          name="description"
          content="Create a new project in Minicule to visualize and manage your knowledge effectively."
        />
      </Helmet>
      <div className="container mx-auto  py-8">
        <div className="flex justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">Create New Project</h1>
            <p className="text-slate-500">
              Import data, define relationships, and visualize your research
            </p>
          </div>
        </div>

        {/* Card Container */}

        <CreateProjectForm />
      </div>
    </>
  );
};

export default CreateProject;
