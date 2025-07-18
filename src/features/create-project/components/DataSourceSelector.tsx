import CreateProjectLocalFileUpload from "./LocalFileUpload";
import React, { useState } from "react";

interface DataSource {
  id: string;
  title: string;
  icon: React.ElementType;
}

interface SelectedFile {
  id: string;
  title: string;
  source: string;
}

interface DataSourceSelectorProps {
  DATA_SOURCES: DataSource[];
}

// Skeleton loader component

const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  DATA_SOURCES,
}) => {
  // Group flat results by source
  type SearchResult = {
    id: string;
    title: string;
    authors?: string;
    source?: string;
    source_id?: string;
  };

  // Flatten entries from all sources and tag with sourceName
  interface SourceApiResult {
    sourceName: string;
    entries: SearchResult[];
  }

  const localSource = DATA_SOURCES.find((source) => source.id === "local");

  const showUpload = "local";

  return (
    <div className="space-y-6">
      {/* Data Sources Section (Local + Other Sources) */}
      {localSource && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            Import from local files
          </h3>
        </div>
      )}

      {showUpload && (
        <div className="mt-6">
          <CreateProjectLocalFileUpload projectId={null} userId={null} />
        </div>
      )}

      {/* Search and Filters Section */}
    </div>
  );
};

export default DataSourceSelector;
