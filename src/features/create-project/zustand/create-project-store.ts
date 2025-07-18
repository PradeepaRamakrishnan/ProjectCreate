import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createProjectSlice, CreateProjectState } from './create-project-slice';

export const useCreateProjectStore = create<CreateProjectState>()(
  persist(createProjectSlice, {
    name: 'create-project',
    partialize: (state) => ({
      step: state.step,
      selectedSourceNames: state.selectedSourceNames,
      selectedSourceIds: state.selectedSourceIds,
      projectName: state.projectName,
      projectDescription: state.projectDescription,
      visibility: state.visibility,
      selectedTeam: state.selectedTeam,
    }),
  })
); 