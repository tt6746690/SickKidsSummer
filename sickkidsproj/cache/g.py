import os
from sickkidsproj import app

# testing purpose
ONE_EXPRDATA = os.path.join(app.config["EXPRIMENT_DATA_DIR"],"10-1-M")

# panels
GENE_PANELS = []
GENE_PANEL_PATHS = []
with open(app.config["GENE_PANEL_LIST"], "r") as f:
    for panel in f.read().strip().split('\n'):
        GENE_PANELS.append(panel)
        GENE_PANEL_PATHS.append(os.path.join(app.config["GENE_PANEL_DIR"], panel))

TISSUE_SITES = []
with open(app.config["TISSUE_SITE_LIST"], "r") as f:
    for tissueSite in f.read().strip().split('\n'):
        TISSUE_SITES.append(tissueSite)

# testing purposes
ONE_EXONEXPR = os.path.join(app.config["EXON_EXPR_DIR"], "47/ENSG00000182533")

def get_panel_gene(panel):
    """ Gets list of gene associated with a gene panel
        @param str gene_panel
        @rType dict: 
        [ ..., {
                "ensembl_id": "ENSG00000138435",
                "symbol": "CHRNA1"
            },
        ] 
    """
    genes = []
    with open(os.path.join(app.config["GENE_PANEL_DIR"], panel), 'r') as f:
        for line in f:
            pair = line.split('\t')
            genes.append({
                "symbol": pair[0].strip(),
                "ensembl_id": pair[1].strip()
                })
        return genes

PANEL_REF = {}
for panel in GENE_PANELS:
    PANEL_REF[panel] = get_panel_gene(panel)


""" A reference dictionary that maps ensembl_id to gene_symbol
    @rType: {
        ensembl_id: gene_symbol
    } 
"""
GENE_SYMBOL_REF = {}
with open(app.config["GENE_SYMBOL_MAPPING"], 'r') as f:
    for l in f.read().strip().split('\n'):
        ll = l.strip().split('\t')

        ensembl_id = ll[0]
        symbol = ""
        if len(ll) == 2:
            symbol = ll[1]

        GENE_SYMBOL_REF[ensembl_id] = symbol



""" EXPRDATA_FILEPATHS [...exprdata_fp]
    A list of file path for experimental data in terms of exon reads
"""
def get_all_exprdata_filepaths():
    fps = []
    for f in os.listdir(app.config["EXPRIMENT_DATA_DIR"]):
        if not f.startswith('.') and not f.endswith('coverage') and not f.endswith('.sh'):
            fps.append(os.path.join(app.config["EXPRIMENT_DATA_DIR"], f))
    return fps
EXPRDATA_FILEPATHS = get_all_exprdata_filepaths()



# dev specific globals
if app.config["DEBUG"]:

    GENCODEID_STRAND_REF = {}          # gencodeid -> strand +/-
    ENSEMBLID_EXONCOUNT_REF = {}       # ensembl_id -> exon_count

    with open(app.config["GENCODE_EXON_POS_ID_MAPPING"], 'r') as f:
        f.readline()

        for line in f:
            row = line.strip().split('\t')
            assert(len(row) == 5)

            gencodeid = row[0]
            ensembl_id = gencodeid.split('.')[0]
            strand = row[-1]

            # assumes entries in f unique, 
            if ensembl_id not in ENSEMBLID_EXONCOUNT_REF: 
                ENSEMBLID_EXONCOUNT_REF[ensembl_id] = 1
            else:
                ENSEMBLID_EXONCOUNT_REF[ensembl_id] += 1

            GENCODEID_STRAND_REF[gencodeid] = strand






