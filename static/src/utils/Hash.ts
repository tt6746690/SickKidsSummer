export const getGeneSetHash = (ensemblIds: string[]): string => {
  return ensemblIds.map(id => Number(id.slice(4))).sort().join("_");
};
