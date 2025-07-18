import { StateCreator } from "zustand";

export interface SelectedFile {
  id: string;
  title: string;
  source: string;
  source_id: string;
}

export interface CreateProjectState {
  step: number;
  selectedSourceNames: string[];
  selectedSourceIds: SelectedFile[];
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
  setSelectedSourceNames: (names: string[]) => void;
  setSelectedSourceIds: (ids: SelectedFile[]) => void;
  addSelectedSourceId: (file: SelectedFile) => void;
  removeSelectedSourceId: (file: SelectedFile) => void;
  toggleSelectedSourceId: (file: SelectedFile) => void;
  setAllSelectedSourceIds: (files: SelectedFile[]) => void;
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
  selectedSourceNames: [
    "pubmed",
    "clinical_trials",
    "uspto",
    "uniprot",
    "local",
    "openalex",
  ],
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
  setSelectedSourceNames: (names) => set({ selectedSourceNames: names }),
  setSelectedSourceIds: (ids) => set({ selectedSourceIds: ids }),
  addSelectedSourceId: (file) => {
    const prev = get().selectedSourceIds;
    if (!prev.some((f) => f.id === file.id && f.source === file.source)) {
      set({ selectedSourceIds: [...prev, file] });
    }
  },
  removeSelectedSourceId: (file) => {
    set({
      selectedSourceIds: get().selectedSourceIds.filter(
        (f) => !(f.id === file.id && f.source === file.source)
      ),
    });
  },
  toggleSelectedSourceId: (file) => {
    const prev = get().selectedSourceIds;
    set({
      selectedSourceIds: prev.some(
        (f) => f.id === file.id && f.source === file.source
      )
        ? prev.filter((f) => !(f.id === file.id && f.source === file.source))
        : [...prev, file],
    });
  },
  setAllSelectedSourceIds: (files) => set({ selectedSourceIds: files }),
  setProjectName: (name) => set({ projectName: name }),
  setProjectDescription: (desc) => set({ projectDescription: desc }),
  setVisibility: (vis) => set({ visibility: vis }),
  setUploadedFiles: (files) => set({ uploadedFiles: files }),
  setSelectedLocalFiles: (files) => set({ selectedLocalFiles: files }),
  setSelectedTeam: (teamId) => set({ selectedTeam: teamId }),
  reset: () => set({ ...defaultCreateProjectState }),
});
