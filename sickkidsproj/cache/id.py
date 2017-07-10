import os
from sickkidsproj import app

from sickkidsproj.cache.g import ONE_EXPRDATA

def combine_pos(start, end):
    """ combine start position and end position into a single string

        @param start str
        @param end str
        @rType pos str: combination of start and end 
    """
    return start + "." + end
def reverse_pos(pos):
    """ Separate pos into start and end position 
        
        @param pos string
        @rType [start_pos, end_pos]
    """
    return pos.split(".")


def connect_ense_to_gtex_exonid():
    """ Loads pos={start, stop} & ensembl exon id (ense) mapping from ON_EXPRDATA
        Loads pos={start, stop} & gtex exon id (gencode) mapping from GENCODE_EXON_POS_ID_MAPPING
        Populate them into dictionary ensed, and gencoded
        
        Loop over ensed, check if there is a corresponding pos in gencode,
        if there is, append gencode exon id to the dictinoary value 
        
        Writes [start, end, ense, gencode] into file
    """
    ensed = {}
    gencoded = {}

    with open(app.config["GENCODE_EXON_POS_ID_MAPPING"], "r") as gencodef, open(ONE_EXPRDATA, "r") as ensef:
        with open(app.config["EXON_ID_MAPPING"], 'w+') as outf:

            gencodef.readline()
            ensef.readline()

            iterations = 1

            for gencodel in gencodef:
                gencodellist = gencodel.strip().split('\t')
                assert(len(gencodellist) == 5)

                pos = combine_pos(gencodellist[2], gencodellist[3])
                gtex_exonid = gencodellist[0]

                gencoded[pos] = gtex_exonid


            iterations = 1
            for ensel in ensef:
                ensellist = ensel.strip().split("\t")
                assert(len(ensellist) == 5)
                
                pos = combine_pos(ensellist[1], ensellist[2])
                ense_exonid = ensellist[3]

                ensed[pos] = [ense_exonid]

        
            for pos, ense in ensed.items():
                if pos in gencoded:
                    ensed[pos].append(gencoded[pos])     # i.e. ensed[11869.12227] = [ENSE00002319515, ENSG00000223972.4_0]
                else:
                    ensed[pos].append("")
            
            outf.write('\t'.join(["start", "end", "ense", "gencode"]) + '\n')
            for pos, ids in ensed.items():
                ense, gencode = ids
                start, end = reverse_pos(pos)

                l = '\t'.join([start, end, ense, gencode]) + '\n'
                print(l)

                outf.write(l)


def create_exonid_cache():
    connect_ense_to_gtex_exonid()

            


