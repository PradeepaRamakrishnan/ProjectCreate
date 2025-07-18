import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateProjectStore } from "../zustand/create-project-store";
import { useNavigate } from "react-router-dom";
import { useTeamsQuery } from "../useCreateProjectQuery";

interface ProjectInformationFormProps {
  teamError: string;
  setTeamError: (err: string) => void;
  error: boolean;
  errorObj: unknown;
}

const ProjectInformationForm: React.FC<ProjectInformationFormProps> = ({
  teamError,
  setTeamError,
  error,
  errorObj,
}) => {
  const navigate = useNavigate();
  const projectName = useCreateProjectStore((s) => s.projectName);
  const setProjectName = useCreateProjectStore((s) => s.setProjectName);
  const projectDescription = useCreateProjectStore((s) => s.projectDescription);
  const setProjectDescription = useCreateProjectStore((s) => s.setProjectDescription);
  const visibility = useCreateProjectStore((s) => s.visibility);
  const setVisibility = useCreateProjectStore((s) => s.setVisibility);
  const selectedTeam = useCreateProjectStore((s) => s.selectedTeam);
  const setSelectedTeam = useCreateProjectStore((s) => s.setSelectedTeam);

  // Fetch teams here
  const { data: teams = [], isLoading: isTeamsLoading } = useTeamsQuery(visibility);

  // Handle visibility change here
  const handleVisibilityChange = (value: string) => {
    setVisibility(value);
    if (value !== "team") setSelectedTeam("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800 mb-2">Project Information</h3>
      <div>
        <label htmlFor="projectName" className="block text-xs font-medium text-gray-700 mb-0.5">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          id="projectName"
          type="text"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="Enter a name for your project"
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          maxLength={255}
          required
        />
        <div className="text-xs text-gray-500 text-right mt-1">{projectName.length}/255</div>
      </div>
      <div>
        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-0.5">
          Description
        </label>
        <textarea
          id="description"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="Briefly describe what this project represents (optional)"
          value={projectDescription}
          onChange={e => setProjectDescription(e.target.value)}
          maxLength={255}
          rows={4}
        />
        <div className="text-xs text-gray-500 text-right mt-1">{projectDescription.length}/255</div>
      </div>
      <div className="space-y-2 mt-0">
        <label className="block text-xs font-medium text-gray-700 mb-0.5">
          Visibility <span className="text-red-500">*</span>
        </label>
        <Select value={visibility} onValueChange={handleVisibilityChange}>
          <SelectTrigger className="w-full border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="team">Team</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {visibility === "team" && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Select Team <span className="text-red-500">*</span>
          </label>
          {isTeamsLoading ? (
            <div className="text-xs text-muted-foreground">Loading teams...</div>
          ) : teams && teams.length > 0 ? (
            <>
              <Select
                value={selectedTeam}
                onValueChange={value => { setSelectedTeam(value); setTeamError(""); }}
              >
                <SelectTrigger className="w-full border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id} className="cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-700">
                          {team.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          {team.description && (
                            <p className="text-xs text-gray-500">{team.description}</p>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedTeam && (
                <p className="text-xs text-red-500 mt-1">Select your team</p>
              )}
              {teamError && <p className="text-xs text-red-500 mt-1">{teamError}</p>}
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-red-500">You don't have any teams. Please create a team.</p>
              <Button
                variant="outline"
                className="w-fit border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm px-3 py-1"
                onClick={() => navigate("/teams")}
              >
                Go to Teams
              </Button>
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="text-red-500 text-sm mt-2">{errorObj instanceof Error ? errorObj.message : "Failed to create project"}</div>
      )}
    </div>
  );
};

export default ProjectInformationForm; 