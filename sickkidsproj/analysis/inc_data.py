from sickkidsproj import app, db
from sickkidsproj.database.query import get_exonexpr_storepath
from sickkidsproj.cache.g import ONE_EXPRDATA, GENCODEID_STRAND_REF, ENSEMBLID_EXONCOUNT_REF, EXPRDATA_FILEPATHS
from sickkidsproj.utils.check import isEnsemblId

# Get proper exon number based on strand +/-
# Given id = , exon_num = 0
# if strand -> + : exon += 1
# if strand -> - : exon = exon_count - exon_num
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
    assert(strand == "+" or strand == "-", "invalid strand {} or empty GENCODEID_STRAND_REF".format(strand))

    exon_num = int(gencodeid.strip().split('_')[-1])
    ensembl_id = gencodeid.strip().split('.')[0]
    exon_count = ENSEMBLID_EXONCOUNT_REF[ensembl_id]

    if(strand == "+"):
        exon_num += 1
    else:
        exon_num = exon_count - exon_num
    
    return (ensembl_id, exon_num)


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

    for ensembl_id, exon_expr_per_gene in exon_expr.items():
        dst_exonexpr_fp = get_exonexpr_storepath(ensembl_id)
        
        print(dst_exonexpr_fp)
        print(exon_expr_per_gene)


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
        iterations = 10

        for line in inf:

            row = line.strip().split('\t')
            assert(len(row) == 5)

            exonid = row[3]
            read = float(row[4])
            ensembl_id, exon_num = extract_gencodeid(exonid)

            assert(read >= 0 and isinstance(read, float), "invalid read {}".format(read))
            assert(isEnsemblId(ensembl_id), "invalid ensembl_id {}".format(ensembl_id))
            assert(exon_num > 0 and isinstance(exon_num, int), "invalid exon_num {}".format(exon_num))

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















