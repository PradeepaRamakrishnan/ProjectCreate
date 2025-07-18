import React, { useEffect } from "react";

import {
  BookOpen,
  Globe,
  Database,
  FileText,
  CircleDot,
  CheckCircle,
  Check,
} from "lucide-react";
import { useCreateProjectStore } from "../zustand/create-project-store";
import ProjectInformationForm from "./ProjectInformationForm";
import { useNavigate } from "react-router-dom";
import DataSourceSelector from "./DataSourceSelector";
import { useCreateProjectMutation } from "../useCreateProjectQuery";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const DATA_SOURCES = [
  { id: "pubmed", title: "PubMed", icon: BookOpen },
  { id: "openalex", title: "OpenAlex", icon: Globe },
  { id: "uspto", title: "Uspto", icon: Database },
  { id: "uniprot", title: "Uniprot", icon: CircleDot },
  { id: "clinical_trials", title: "Clinical Trial", icon: Database },
  { id: "local", title: "Local Files", icon: FileText },
];

const CreateProjectForm: React.FC = () => {
  // Use zustand store for all state
  const {
    step,
    setStep,
    selectedSourceIds,
    setSelectedSourceIds,
    projectName,
    projectDescription,
    visibility,
    selectedTeam,
    uploadedFiles,
    reset,
  } = useCreateProjectStore();

  const {
    mutateAsync: createProject,
    isPending: loading,
    isError: error,
    error: errorObj,
    isSuccess: isProjectCreated,
  } = useCreateProjectMutation();

  const navigate = useNavigate();
  const [timer, setTimer] = React.useState(5);

  const [teamError, setTeamError] = React.useState("");

  const selectedLocalFiles = useCreateProjectStore((s) => s.selectedLocalFiles);

  const canGoNext =
    step === 1
      ? selectedSourceIds.length > 0 || uploadedFiles.length > 0
      : step === 2
      ? projectName.trim().length > 0
      : false;

  const isFormValid =
    projectName.trim().length > 0 && (visibility !== "team" || selectedTeam);

  // Helper: check if there are un-uploaded local files
  const hasUnuploadedLocalFiles = selectedLocalFiles.length > 0;

  // Reset store on successful project creation
  React.useEffect(() => {
    if (error) {
      setTeamError("Failed to create project. Please try again.");
    }
  }, [error]);

  // On successful project creation, move to step 3 and start timer
  React.useEffect(() => {
    if (error) {
      setTeamError("Failed to create project. Please try again.");
    }
  }, [error]);

  React.useEffect(() => {
    if (step === 3 && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (step === 3 && timer === 0) {
      reset();
      navigate("/dashboard"); // Change to your dashboard route
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, timer, navigate]);

  const handleCreateProject = () => {
    if (!isFormValid) return;

    const organizedSources = {
      pubmed: [],
      clinical_trials: [],
      uspto: [],
      uniprot: [],
      openalex: [],
    };

    for (const file of selectedSourceIds) {
      const source = file.source;
      if (organizedSources[source]) {
        organizedSources[source].push(file.id);
      }
    }

    const organizedFiles = {
      pubmed: [],
      clinical_trials: [],
      uspto: [],
      uniprot: [],
      local: [],
      openalex: [],
    };

    for (const file of uploadedFiles) {
      const source = "local";
      if (organizedFiles[source]) {
        organizedFiles[source].push(file);
      }
    }

    const payload = {
      name: projectName,
      description: projectDescription,
      visibility: visibility,
      ...(visibility === "team" && { team_id: selectedTeam }),
      sources: organizedSources,
      files: organizedFiles,
    };

    if (visibility === "team" && !selectedTeam) {
      setTeamError("Please select a team for team projects.");
      return;
    }

    createProject(payload);
  };

  useEffect(() => {
    if (isProjectCreated) {
      setStep(3);
    }
  }, [isProjectCreated, setStep]);

  // Stepper UI
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="w-full mx-auto">
        {/* Stepper Indicator */}
        <div className="flex flex-col items-center justify-center mb-10 w-full">
          <div className="flex items-center w-full  mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center border-2 text-base font-bold transition-all duration-300 ${
                  step > 1
                    ? "border-blue-600 bg-blue-600 text-white"
                    : step === 1
                    ? "border-purple-500 bg-white text-purple-700 shadow-lg scale-110"
                    : "border-gray-300 bg-gray-50 text-gray-400"
                }`}
              >
                {step > 1 ? <Check className="w-5 h-5" /> : 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step === 1 ? "text-purple-700 font-semibold" : "text-gray-500"
                }`}
              >
                Import Data
              </span>
            </div>
            {/* Line 1 */}
            <div className="h-px bg-gray-300 flex-1 mx-2" />
            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center border-2 text-base font-bold transition-all duration-300 ${
                  step > 2
                    ? "border-blue-600 bg-blue-600 text-white"
                    : step === 2
                    ? "border-purple-500 bg-white text-purple-700 shadow-lg scale-110"
                    : "border-gray-300 bg-gray-50 text-gray-400"
                }`}
              >
                {step > 2 ? <Check className="w-5 h-5" /> : 2}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step === 2 ? "text-purple-700 font-semibold" : "text-gray-500"
                }`}
              >
                Project Info
              </span>
            </div>
            {/* Line 2 */}
            <div className="h-px bg-gray-300 flex-1 mx-2" />
            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center border-2 text-base font-bold transition-all duration-300 ${
                  step === 3
                    ? "border-purple-500 bg-white text-purple-700 shadow-lg scale-110"
                    : "border-gray-300 bg-gray-50 text-gray-400"
                }`}
              >
                3
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step === 3 ? "text-purple-700 font-semibold" : "text-gray-500"
                }`}
              >
                Done
              </span>
            </div>
          </div>
        </div>
        <form className="space-y-10 w-full">
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 w-full">
              <DataSourceSelector
                selectedSourceIds={selectedSourceIds}
                onChange={setSelectedSourceIds}
                DATA_SOURCES={DATA_SOURCES}
              />
              <div className="flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-4 mt-4 w-full">
                {hasUnuploadedLocalFiles && (
                  <Alert className="w-full mb-2 flex flex-col md:flex-row items-start md:items-center gap-2 bg-yellow-50 border-yellow-400">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <div>
                      <AlertTitle className="text-yellow-700">
                        Action Required
                      </AlertTitle>
                      <AlertDescription className="text-yellow-600 break-words">
                        Please upload your selected files before proceeding.
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
                <button
                  type="button"
                  className="px-5 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 disabled:opacity-60 w-full sm:w-auto"
                  onClick={() => {
                    if (hasUnuploadedLocalFiles) {
                      toast.error(
                        "Please upload your selected files before proceeding to the next step."
                      );
                      return;
                    }
                    setStep(2);
                  }}
                  disabled={!canGoNext}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-10 w-full">
              <ProjectInformationForm
                teamError={teamError}
                setTeamError={setTeamError}
                error={error}
                errorObj={errorObj}
              />
              <div className="flex justify-between ">
                <button
                  type="button"
                  className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                  disabled={loading || !isFormValid}
                  onClick={handleCreateProject}
                >
                  {loading ? "Creating..." : "Create Project"}
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 w-full flex flex-col items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Project Created Successfully!
              </h2>
              <p className="text-gray-600 mb-4">
                Redirecting to your dashboard in {timer} seconds...
              </p>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                onClick={() => {
                  reset();
                  navigate("/dashboard");
                }}
                type="button"
              >
                Go to Dashboard Now
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;
