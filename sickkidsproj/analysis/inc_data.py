import os
import json

from sickkidsproj import app, db
from sickkidsproj.database.query import get_exonexpr_storepath
from sickkidsproj.cache.g import ONE_EXPRDATA, GENCODEID_STRAND_REF, ENSEMBLID_EXONCOUNT_REF, EXPRDATA_FILEPATHS, INC_EXT
from sickkidsproj.utils.check import isEnsemblId


def extract_gencodeid(gencodeid):
    """ splits gencode exonid to ensembl_id and exon_num based on strand +/-
        + --> exon_num += 1
        - --> exon_num = exon_count - exon_num

        @param gencodeid str: ENSG00000000003.10_0
        @rType (ensembl_id, exon_num) 
    """

    if gencodeid not in GENCODEID_STRAND_REF:
        raise Exception("invalid gencodeid {} or empty GENECODEID_STRAND_REF".format(gencodeid))

    strand = GENCODEID_STRAND_REF[gencodeid]
    assert (strand == "+" or strand == "-"), "invalid strand {} or empty GENCODEID_STRAND_REF".format(strand)

    exon_num = int(gencodeid.strip().split('_')[-1])
    ensembl_id = gencodeid.strip().split('.')[0]
    exon_count = ENSEMBLID_EXONCOUNT_REF[ensembl_id]

    if(strand == "+"):
        exon_num += 1
    else:
        exon_num = exon_count - exon_num
    
    return (ensembl_id, str(exon_num))



def add_to_exonexpr(exon_expr, filename = ONE_EXPRDATA):
    """ Incorporates exon expr experimental data under /data/experiment 
        to resources/exon_expr
        
        Precondition: rows sorted by ensemblid, exons of same gene are local

        @param filename str
        @param exon_expr {
            ensembl_id: {
                exon_num:{
                    tissueSite: [ ..., read ]
                }, ...
            }, ...
        }
    """

    tissueSite = filename.strip().split('-')[-1]
        
    with open(filename, 'r') as inf:

        inf.readline()
        iterations = 0
        for line in inf:

            row = line.strip().split('\t')
            assert(len(row) == 5)

            exonid = row[3]
            read = float(row[4])
            ensembl_id, exon_num = extract_gencodeid(exonid)

            assert (read >= 0 and isinstance(read, float)), "invalid read {}".format(read)
            assert (isEnsemblId(ensembl_id)), "invalid ensembl_id {}".format(ensembl_id)
            assert (isinstance(exon_num, str)), "invalid exon_num {}".format(exon_num)

            if ensembl_id not in exon_expr:
                exon_expr[ensembl_id] = {}
            if exon_num not in exon_expr[ensembl_id]:
                exon_expr[ensembl_id][exon_num] = {}
            if tissueSite not in exon_expr[ensembl_id][exon_num]:
                exon_expr[ensembl_id][exon_num][tissueSite] = []

            exon_expr[ensembl_id][exon_num][tissueSite].append(read)

            iterations -= 1
            if iterations < 0:
                break


def merge_exonexpr(src_exonexpr, new_exonexpr):
    """ Merges new_exonexpr into src_exonexpr
        -- new_exonexpr.<exon_num>.tissueSite 
        ---- no tissueSite key in src_exonexpr.<exon_num>
        ------ tissueSite: [ ..., reads ] added to src_exonexpr
        ---- appends new reads into src exon_expr tissueSite list

        @precondition
        -- new_exonexpr.<exon_num> cannot invent new exon_num compared to src_exonexpr.exon_num
        
        @param src_exonexpr dict
        @param new_exonexpr dict
        
        Both src_exonexpr, and new_exonexpr
        {
            exon_num: {
                tissueSite: [ ..., reads ]
            }, ...
        }
    """


    src_exon_nums = list(src_exonexpr.keys()) 

    #  print("before", src_exonexpr)
    for exon_num, tissueSiteReads in new_exonexpr.items():
        if exon_num not in src_exon_nums:
            raise Exception("Experimental data generated exon number {} not present in GTex exon_expr".format(exon_num))
        # src_exonexpr[exon_num] is valid here

        for tissueSite, reads in new_exonexpr[exon_num].items():
            if tissueSite not in src_exonexpr[exon_num]:
                src_exonexpr[exon_num][tissueSite] = []
            src_exonexpr[exon_num][tissueSite].extend(reads)
    #  print("after", src_exonexpr)




def inc_data(datafiles = EXPRDATA_FILEPATHS):
    """ Incoporates exon expression located in datafiles
        into resources/exon_expr
        -- combine and format read data to exon_expr
        -- Iterates exon_expr and for each gene
        ---- queries database to locate the files storing reads under resources/exon_expr
        ---- Merge exon_expr for this gene to the corresponding file, appends `.inc` extension
    """

    exon_expr = {}
    for filename in datafiles:
        add_to_exonexpr(exon_expr, filename)

    files_modified = []
    for ensembl_id, exon_expr_per_gene in exon_expr.items():
        src_fp = get_exonexpr_storepath(ensembl_id)
        dst_fp = src_fp + "." + INC_EXT

        # Since only a small subset in mapping is in resources/exon_expr, 
        # we skip over files and continues merging only if file exists
        if os.path.exists(src_fp):
            with open(src_fp, 'r') as inf:
                with open(dst_fp, "w+") as outf:

                    merged_exon_expr = json.loads(inf.read())
                    merge_exonexpr(merged_exon_expr, exon_expr_per_gene)
                    outf.write(json.dumps(merged_exon_expr))

            print("Merged to {}...".format(src_fp))
            files_modified.append(src_fp)
    print(files_modified)












