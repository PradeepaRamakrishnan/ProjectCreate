import { StateCreator } from "zustand";

export interface SelectedFile {
  id: string;
  title: string;
  source: string;
  source_id: string;
}

export interface CreateProjectState {
  step: number;
  projectName: string;
  projectDescription: string;
  visibility: string;
  uploadedFiles: {
    url: string;
    source: string;
    name: string;
    size: number;
    type: string;
  }[];
  selectedLocalFiles: File[];
  selectedTeam: string;
  setStep: (step: number) => void;
 
  setProjectName: (name: string) => void;
  setProjectDescription: (desc: string) => void;
  setVisibility: (vis: string) => void;
  setUploadedFiles: (
    files: {
      url: string;
      source: string;
      name: string;
      size: number;
      type: string;
    }[]
  ) => void;
  setSelectedLocalFiles: (files: File[]) => void;
  setSelectedTeam: (teamId: string) => void;
  reset: () => void;
}

export const defaultCreateProjectState = {
  step: 1,

  selectedSourceIds: [],

  projectName: "",
  projectDescription: "",
  visibility: "public",
  uploadedFiles: [],
  selectedLocalFiles: [],
  selectedTeam: "",
};

export const createProjectSlice: StateCreator<CreateProjectState> = (
  set,
  get
) => ({
  ...defaultCreateProjectState,
  setStep: (step) => set({ step }),
  setProjectName: (name) => set({ projectName: name }),
  setProjectDescription: (desc) => set({ projectDescription: desc }),
  setVisibility: (vis) => set({ visibility: vis }),
  setUploadedFiles: (files) => set({ uploadedFiles: files }),
  setSelectedLocalFiles: (files) => set({ selectedLocalFiles: files }),
  setSelectedTeam: (teamId) => set({ selectedTeam: teamId }),
  reset: () => set({ ...defaultCreateProjectState }),
});
