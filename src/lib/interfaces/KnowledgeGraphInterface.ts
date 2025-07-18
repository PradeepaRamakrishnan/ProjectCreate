interface relationshipData {
  id: string;
}

export interface relationship {
  source: relationshipData;
  target: relationshipData;
  properties: {
    strength: string;
  };
}

interface file {
  created_at?: number;
  name: string;
  url: string;
  size: string;
  _id: string;
}

export interface node {
  id: string;
  color: string;
  files: file[];
  properties?: Record<string, unknown>;
}

export interface KnowledgeGraphInterface {
  session: string;
  _id: string;
  name: string;
  nodes: node[];
  relationships: relationship[];
  files: file[];
  status?: {
    stage: "initiated" | "in_progress" | "completed" | "error";
    document: number;
    steps: number;
    steps_left: number;
    error: string;
  };
  error: {
    message: string;
    timestamp: Date;
    pending_files: Array<string>;
  };
}
