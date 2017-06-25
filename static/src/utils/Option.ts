import { OPTION_TYPE, searchIndexEntity } from "../Interfaces";

export const getOptionByType = (
  options: searchIndexEntity[],
  optionType: OPTION_TYPE.GENE_TYPE | OPTION_TYPE.PANEL_TYPE
): searchIndexEntity[] => {
  return options.filter(opt => opt.type === optionType);
};

export const makeGeneOption = (index: searchIndexEntity): searchIndexEntity => {
  return { ...index, type: OPTION_TYPE.GENE_TYPE };
};

export const makePanelOption = (
  index: searchIndexEntity
): searchIndexEntity => {
  return { ...index, type: OPTION_TYPE.PANEL_TYPE };
};

export const flattenPanelOptionPanelGenes = (
  panelOption: searchIndexEntity[]
): string[] => {
  let accumulatedEmsemblIds = panelOption.reduce(
    (acu, cur) => acu.concat(cur.panelGenes),
    []
  );
  return accumulatedEmsemblIds;
};
