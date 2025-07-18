import CreateProjectLocalFileUpload from "./LocalFileUpload";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { useSearchSourcesMutation } from "../useCreateProjectQuery";
import { toast } from "sonner";
import { useCreateProjectStore } from "../zustand/create-project-store";

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
  selectedSourceIds?: SelectedFile[];
  onChange?: (selected: SelectedFile[]) => void;
  DATA_SOURCES: DataSource[];
}

// Skeleton loader component
const ResultSkeleton = () => (
  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 mb-2 animate-pulse">
    <div className="flex flex-col gap-2 w-full">
      <div className="h-4 w-2/3 bg-slate-200 rounded mb-1" />
      <div className="h-3 w-1/3 bg-slate-100 rounded" />
    </div>
  </div>
);

const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  DATA_SOURCES,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("2000-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [maxResults, setMaxResults] = useState("100");
  const {
    mutate: searchSources,
    isPending: isSearching,
    data: searchResults,
    error: searchError,
  } = useSearchSourcesMutation();

  // Global selection state
  const selectedSourceNames = useCreateProjectStore(
    (s) => s.selectedSourceNames
  );
  const setSelectedSourceNames = useCreateProjectStore(
    (s) => s.setSelectedSourceNames
  );
  const selectedSourceIds = useCreateProjectStore((s) => s.selectedSourceIds);
  const addSelectedSourceId = useCreateProjectStore(
    (s) => s.addSelectedSourceId
  );
  const removeSelectedSourceId = useCreateProjectStore(
    (s) => s.removeSelectedSourceId
  );
  const toggleSelectedSourceId = useCreateProjectStore(
    (s) => s.toggleSelectedSourceId
  );

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
  const flattenedResults: SearchResult[] = React.useMemo(() => {
    if (!searchResults || !Array.isArray(searchResults.sources)) return [];
    return (searchResults.sources as SourceApiResult[]).flatMap((src) =>
      (src.entries || []).map((entry) => ({
        ...entry,
        source: src.sourceName,
      }))
    );
  }, [searchResults]);

  const groupedResults = React.useMemo(() => {
    return flattenedResults.reduce(
      (acc: Record<string, SearchResult[]>, item: SearchResult) => {
        const source = item.source || "unknown";
        if (!acc[source]) acc[source] = [];
        acc[source].push(item);
        return acc;
      },
      {}
    );
  }, [flattenedResults]);

  const localSource = DATA_SOURCES.find((source) => source.id === "local");
  const otherSources = DATA_SOURCES.filter((source) => source.id !== "local");

  // Handle data source selection (including local)
  const handleSourceSelect = (sourceId: string) => {
    const currentSelected = Array.isArray(selectedSourceNames)
      ? selectedSourceNames
      : [];
    setSelectedSourceNames(
      currentSelected.includes(sourceId)
        ? currentSelected.filter((id) => id !== sourceId)
        : [...currentSelected, sourceId]
    );
  };

  // Transform selectedSourceNames array to object structure for API
  const transformSourcesToObject = (sourceNames: string[]) => {
    const sourcesObject: Record<string, Record<string, never>> = {};

    sourceNames.forEach((sourceName) => {
      if (sourceName !== "local") {
        sourcesObject[sourceName] = {};
      }
    });

    return sourcesObject;
  };

  // When searching, use selectedSourceNames for API call
  const handleSearch = () => {
    const currentSelected = Array.isArray(selectedSourceNames)
      ? selectedSourceNames
      : [];

    if (currentSelected.length === 0) {
      toast.error("Please select at least one data source");
      return;
    }

    if (currentSelected.includes("local") && currentSelected.length === 1) {
      toast.error("Please select at least one data source");
      return;
    }

    const sourcesObject = transformSourcesToObject(
      currentSelected.filter((id) => id !== "local")
    );

    searchSources({
      sources: sourcesObject,
      searchTerms: [searchQuery],
      startDate: startDate,
      endDate: endDate,
      maxResults: Number(maxResults),
    });
  };

  const showUpload =
    Array.isArray(selectedSourceNames) && selectedSourceNames.includes("local");

  return (
    <div className="space-y-6">
      {/* Data Sources Section (Local + Other Sources) */}
      {localSource && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            Import from local files
          </h3>
          <div className="flex flex-wrap gap-3 justify-start mb-2">
            <button
              type="button"
              className={`w-full sm:w-auto px-3 py-2 rounded-xl border text-base transition-all duration-200 font-medium flex items-center gap-2 focus:outline-none
                ${
                  Array.isArray(selectedSourceNames) &&
                  selectedSourceNames.includes(localSource.id)
                    ? "border-purple-500 bg-purple-50 text-gray-900 shadow-sm"
                    : "border-gray-200 bg-white text-gray-900 hover:border-purple-50 hover:bg-gray-50"
                }
              `}
              onClick={() => handleSourceSelect(localSource.id)}
            >
              <localSource.icon className="w-4 h-4" />
              {localSource.title}
            </button>
          </div>
        </div>
      )}

      {showUpload && (
        <div className="mt-6">
          <CreateProjectLocalFileUpload projectId={null} userId={null} />
        </div>
      )}

      <Separator className="my-4" />
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-3">
            Search
          </label>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 items-stretch w-full">
            <input
              type="text"
              placeholder="Enter gene names, accession numbers, or identifiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-gray-50 shadow-sm"
            />
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-white text-base font-semibold hover:bg-purple-500 transition-colors duration-200 disabled:opacity-60 shadow-md"
              disabled={!searchQuery.trim()}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {/* Other Data Sources Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-600 mb-1">
            Search From Data Sources
          </h3>
          <div className="flex flex-wrap gap-2 justify-start mb-2">
            {otherSources.map((source) => {
              const Icon = source.icon;
              return (
                <button
                  key={source.id}
                  type="button"
                  className={`w-full sm:w-auto px-3 py-2 rounded-xl border text-sm transition-all duration-200 font-medium flex items-center gap-2 focus:outline-none
                  ${
                    Array.isArray(selectedSourceNames) &&
                    selectedSourceNames.includes(source.id)
                      ? "border-purple-500 bg-purple-50 text-gray-900 shadow-sm"
                      : "border-gray-200 bg-white text-gray-900 hover:border-purple-50 hover:bg-gray-50"
                  }
                `}
                  onClick={() => handleSourceSelect(source.id)}
                >
                  <Icon className="w-4 h-4" />
                  {source.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-2 w-full">
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Publication Date
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-gray-50"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-xs text-gray-500 flex items-center justify-center">
                to
              </span>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-gray-50"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col justify-end w-full">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Max Results
            </label>
            <input
              type="number"
              max="100"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-gray-50 w-24"
              value={maxResults}
              onChange={(e) => setMaxResults(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}

      {/* Results Section */}
      {isSearching ? (
        <div className="mt-6">
          {[...Array(4)].map((_, i) => (
            <ResultSkeleton key={i} />
          ))}
        </div>
      ) : (
        searchResults &&
        Object.keys(groupedResults).length > 0 && (
          <div className="mt-6 space-y-6">
            {(Array.isArray(selectedSourceNames)
              ? selectedSourceNames.filter((source) => source !== "local")
              : []
            ).map((source) => {
              const results = groupedResults[source] || [];
              // When mapping search results:
              const allObjs = Array.isArray(results)
                ? results.map((r) => ({
                    id: String(r.source_id ?? r.id),
                    title: r.title,
                    source,
                    source_id: String(r.source_id ?? r.id),
                  }))
                : [];
              const allSelected =
                Array.isArray(results) &&
                allObjs.length > 0 &&
                allObjs.every((obj) =>
                  selectedSourceIds?.some(
                    (sel) => sel.id === obj.id && sel.source === obj.source
                  )
                );
              return (
                <div key={source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {DATA_SOURCES.find((s) => s.id === source)?.title ||
                        source}{" "}
                      Results ({Array.isArray(results) ? results.length : 0})
                    </div>
                    {Array.isArray(results) && results.length > 0 && (
                      <button
                        type="button"
                        className="text-xs px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"
                        onClick={() => {
                          if (allSelected) {
                            allObjs.forEach((obj) =>
                              removeSelectedSourceId(obj)
                            );
                          } else {
                            allObjs.forEach((obj) => {
                              if (
                                !selectedSourceIds?.some(
                                  (sel) =>
                                    sel.id === obj.id &&
                                    sel.source === obj.source
                                )
                              )
                                addSelectedSourceId(obj);
                            });
                          }
                        }}
                      >
                        {allSelected ? "Deselect All" : "Select All"}
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {Array.isArray(results) && results.length > 0 ? (
                      results.map((result) => {
                        const obj = {
                          id: String(result.source_id ?? result.id),
                          title: result.title,
                          source,
                          source_id: String(result.source_id ?? result.id),
                        };
                        const isSelected = selectedSourceIds?.some(
                          (sel) =>
                            sel.id === obj.id && sel.source === obj.source
                        );
                        return (
                          <div
                            key={
                              source + "__" + (result.source_id ?? result.id)
                            }
                            className={`flex items-center justify-between bg-white p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? "border-purple-500 bg-purple-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => toggleSelectedSourceId(obj)}
                          >
                            <div>
                              <p className="font-medium">{result.title}</p>
                              <p className="text-xs text-slate-600 mt-1">
                                {result.authors}
                                {result.source !== "local" &&
                                (result.source_id ?? result.id) &&
                                String(result.source_id ?? result.id) !== "0" &&
                                String(result.source_id ?? result.id) !== ""
                                  ? ` | ID: ${result.source_id ?? result.id}`
                                  : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <span className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg
                                    className="h-3 w-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </span>
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-slate-500">
                        No results found in{" "}
                        {DATA_SOURCES.find((s) => s.id === source)?.title ||
                          source}
                        .
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
      {/* Show a friendly message if no search has been initiated or results are empty */}
      {(!searchResults || Object.keys(groupedResults).length === 0) &&
        !isSearching && (
          <div className="text-slate-400 text-center py-16">
            Search a source and select a file to get started.
          </div>
        )}
      {/* Selected Files Section */}
      {selectedSourceIds && selectedSourceIds.length > 0 && (
        <>
          <Separator className="my-6" />
          <div className="mb-4">
            <h4 className="font-medium mb-2">
              Selected Source Files ({selectedSourceIds.length})
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedSourceIds.map((file) => (
                <div
                  key={file.source + "__" + file.source_id}
                  className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16V6a2 2 0 012-2h8a2 2 0 012 2v10M4 16h16M4 16v2a2 2 0 002 2h8a2 2 0 002-2v-2M9 10h6"
                        />
                      </svg>
                    </span>
                    <span className="font-medium">
                      {file.title || `ID: ${file.source_id}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">
                      {file.source}
                    </span>
                    <span className="text-green-500">
                      <svg
                        className="inline h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <button
                      className="ml-2 text-red-500 hover:bg-red-100 rounded-full p-1"
                      title="Remove"
                      onClick={() => removeSelectedSourceId(file)}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataSourceSelector;
