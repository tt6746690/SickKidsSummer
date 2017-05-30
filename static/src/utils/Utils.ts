import { geneEntity, stateInterface } from "../Interfaces"
import store from "../store/Store"


export function getGeneEntityById(genes: geneEntity[], ensemblId: string): geneEntity{
    let result = getGeneEntityByIdList(genes, [ensemblId])
    return (result.length == 1) ? result[0] : {} as geneEntity
}

export function getGeneEntityByIdList(genes: geneEntity[], ensemblIds: string[]): geneEntity[]{

    let filtered =  genes.filter((gene) => {
        return ensemblIds.includes(gene.ensemblId)
    })
    return filtered 
} 
  

export function isEmptyObject(obj: any): boolean{
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function isNonEmptyArray(arr: any[]): boolean{
    return typeof arr !== 'undefined' && arr.length > 0
}