/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SourceOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface UploadedFileInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  url: string;
  uploaded_at?: string;
  source?: string;
  title?: string;
  source_id?: string;
  project_id?: string | null;
  metadata?: {
    title?: string;
    authors?: string;
    pmid?: string;
    openalex_id?: string;
    year?: string;
    journal?: string;
    [key: string]: any;
  };
}

export interface ProjectFile extends UploadedFileInfo {
  storage_path: boolean;
  uploaded_at: string;
}

export interface PubMedFile {
  url: string;
  uploaded: any;
  filename: any;
  filesize: any;
  fileUrl: any;
  id: number;
  title: string;
  desc: string;
  source_id: string;
  date: string;
  year: number | null;
  month: number | null;
  day: number | null;
  authors: string[];
  journal: string;
  citations: Citation[];
  type: "publication" | "protein";
}

export interface OpenAlexFile {
  url: string;
  uploaded: any;
  filename: any;
  filesize: any;
  fileUrl: any;
  id: number;
  title: string;
  desc: string;
  source_id: string;
  date: string;
  year: number | null;
  month: number | null;
  day: number | null;
  authors: string[];
  journal: string;
  citations: Citation[];
  type: "publication" | "protein";
  openalex_id?: string;
  doi?: string;
  abstract?: string;
}

export interface Citation {
  citation?: string;
  title?: string;
  authors?: string[];
  journal?: string;
  year?: string;
  volume?: string;
  pages?: string;
  pmid?: string;
  doi?: string;
  identifiers?: {
    pubmed?: string;
    pmc?: string;
    doi?: string;
    openalex?: string;
  };
}

export interface ResearchSource {
  sourceName: string;
  entries: PubMedFile[] | OpenAlexFile[];
}

export interface ResearchResponse {
  sources: ResearchSource[];
}

export interface DocumentsUploadProps {
  handleFileUpload: (
    hasFiles: boolean,
    isImporting: boolean,
    importingFilesCount?: number,
    source?: string
  ) => void;
  projectId?: string | null;
  setUploadedFiles?: (files: UploadedFileInfo[]) => void;
  setSelectedFilesCount?: (count: number) => void;
}

export interface ResearchData {
  pubmed: any[];
  openalex: any[];
  clinicaltrials: any[];
  uspto: any[];
  uniprot: any[];
}

export type ResearchEntry = {
  id?: number;
  title: string;
  desc: string;
  source_id: string;
  date: string;
  year: number | null;
  month: number | null;
  day: number | null;
  authors: string[];
  journal?: string | null;
  citations?: Citation[];
  type: string; // e.g. "publication" | "protein" | "experiment" | etc.
  tags?: string[];
};
