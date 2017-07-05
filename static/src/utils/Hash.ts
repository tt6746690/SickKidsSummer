import { pad } from "./Utils";

export const getGeneSetHash = (ensemblIds: string[]): string => {
  return ensemblIds.map(id => Number(id.slice(4))).sort().join("_");
};
export const reverseGeneSetHash = (genePanelId: string): string[] => {
  return genePanelId.split("_").map(suffix => "ENSG" + pad(suffix, "0", 11));
};
