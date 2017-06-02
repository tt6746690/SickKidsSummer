import { geneEntity, genePanelEntity, stateInterface } from "../Interfaces"

export function getGeneEntityById(
    genes: geneEntity[], ensemblId: string): geneEntity{

    let result = getGeneEntityByIdList(genes, [ensemblId])
    return (result.length == 1) ? result[0] : {} as geneEntity
}

export function getGeneEntityByIdList(
    genes: geneEntity[], ensemblIds: string[]): geneEntity[]{

    let filtered = genes.filter((gene) => {
        return ensemblIds.includes(gene.ensemblId)
    })
    return filtered || [] as geneEntity[]
} 

export function getGenePanelEntityById(
   genePanel: genePanelEntity[], genePanelIds: string): genePanelEntity{

    let result = getGenePanelEntityByIdList(genePanel, [genePanelIds])
    return (result.length == 1) ? result[0] : {} as genePanelEntity
}

export function getGenePanelEntityByIdList(
    genePanel: genePanelEntity[], genePanelIds: string[]): genePanelEntity[]{

    let filtered = genePanel.filter((panel) => {
        return genePanelIds.includes(panel.genePanelId)
    })
    return filtered || [] as genePanelEntity[]
}

