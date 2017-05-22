
import pandas as pd
import matplotlib.pyplot as plt
#  import mygene
from scipy import stats
import numpy as np
import json
import os

#  mg = mygene.MyGeneInfo()

WD="/hpf/projects/brudno/wangpeiq/sickkids_summer/"
# WD="../"
SAMPLE_ANNOTATION = WD + "data/annotation/GTEx_Data_V6_Annotations_SampleAttributesDS.txt"
EXON_EXPR_DATA = WD + "data/GTEx_Analysis_v6_RNA-seq_RNA-SeQCv1.1.8_exon_reads.txt"
EXON_REF = WD + "data/gencode.v19.genes.patched_contigs_exons.txt"
PHENOTYPE_ANNOTATION = WD + "data/annotation/GTEx_Data_V6_Annotations_SubjectPhenotypesDS.txt"

DEST_STORE = WD + "resources/exon_expr/"
STORAGE_MAPPING = WD + "resources/mapping"

# GENE_SYMBOL = "TNMD"
# TISSUES = ["Muscle -  ", "Cells - Transformed fibroblasts"]
# MIN_THRESHOLD = 20



smp_anno = pd.read_table(SAMPLE_ANNOTATION)
smp_anno_extr = smp_anno[["SAMPID", "SMTSD"]]

# Join exon reference table with exon expression table
exon_ref = pd.read_table(EXON_REF)
exon_ref["Id"] = exon_ref["Gene"]
del exon_ref["Gene"]



# Get proper exon number based on strand +/-
# Given id = ENSG00000000003.10_0, exon_num = 0
# if strand -> + : exon += 1
# if strand -> - : exon = exon_count - exon_num
def getProperExonNumber(row):
    if(row.strand == "+"):
        return int(row.Id.split("_")[1]) + 1
    elif(row.strand == "-"):
        return row.exon_count - int(row.Id.split("_")[1])
    else:
        raise Exception("invalid strand value (not +/-)")

def processOne(exon, line_num):

    gid = exon["ensemblGeneId"].iloc[0]

    exon = exon.set_index('Id').join(exon_ref.set_index('Id')).reset_index()

    # Create a exon_count column
    exon["exon_count"] = exon.groupby("ensemblGeneId")["ensemblGeneId"].transform('count')
    exon["exon"] = exon.apply(getProperExonNumber, axis=1)

    # subset based on symbol == already subsetted
    # df = exon.loc[
    #     (exon["ensemblGeneId"] == gid)
    # ]

    df_t = exon.transpose()
    
    # save gene specific metadata to dataframe._metadata
    genedata = {}
    #  genedata["gene_symbol"] = df["symbol"].iloc[0]
    genedata["ensembl_id"] = exon["ensemblGeneId"].iloc[0]
    genedata["chr"] = exon["CHR"].iloc[0]

    # Drop irrelevant rows
    df_t.columns = df_t.loc["exon"]
    df_t = df_t.drop(["ensemblGeneId",
                      #  "symbol",
                      "CHR",
                      "start",
                      "stop",
                      "strand",
                      "exon_count",
                      "exon",
                      "Id"])
    

    # Group gene-specific exon expression by tissue type
    # End result a 53 (SMTSD) x ~10 (exon_counts), each cell holds an array
    # merge with sample annotation (specifically SMTSD, tissue type detail)
    # Note merging tables has to be done in this step!
    df_tissue = df_t.join(smp_anno_extr.set_index('SAMPID')).set_index("SMTSD")




    # populate list by tissue type
    # all_tissue_expr = { exon_num: {tissueType: [ expr...], ...} }
    all_tissue_expr = {}
    for col in df_tissue.columns:
        cur_tissue_expr = df_tissue.groupby(df_tissue.index)[
            col].apply(lambda x: list(x)).to_dict()
        all_tissue_expr[col] = cur_tissue_expr

    genedata["exon_expression"] = all_tissue_expr

    
    # separate into 200 bins 

    dir_path = os.path.join(DEST_STORE, str(line_num % 200))
    full_path = os.path.join(dir_path, gid)

    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

    with open(full_path, "w") as fp:
        json.dump(genedata, fp)
    with open(STORAGE_MAPPING, "a") as fp:
        fp.write(gid + '\t' + full_path + '\n')
    
    del exon
    del df_t
    del df_tissue
    del all_tissue_expr
    del genedata





# Pre-process data for bar plots
def subsetBasedOnTissue(data, tissues):
    """ extract expression data for one gene
    given a list of tissues in interest 
        
        @param data: pre-computed data (per gene)
        @param tissues: [tissueType: str]
        @rType:            
            [{tissueType: {indexas(exon_num): [expr...]}}...]
    """
    expr = genedata["exon_expression"]
    
    ret = []
    
    for tissue in tissues:
        cur_tissue_expr = {}
        for exon_num in expr:
            cur_tissue_expr[exon_num] = expr[exon_num][tissue]
        ret.append({tissue: cur_tissue_expr}) 
    return ret

def getDataForPlot(subset):
    # plotdata: [ each tissue:{means:[], exons: []}, ... ]
    plotdata = []

    for t in subset:
        tissue_expression = t.values()
        exons = []
        means = []
        stdevs = []
        for exons_expr in tissue_expression:
            # k: {indexas(exon_num): [expr...]}
            for exon_num in exons_expr.keys():
                exons.append(exon_num)
                means.append(np.mean(exons_expr[exon_num]))
                stdevs.append(np.std(exons_expr[exon_num]))
        plotdata.append({
            "mean": means,
            "exon": exons,
            "stdev": stdevs
        })
    return plotdata

def plotBarGraph(plotd):
    # Plotting barplot y-axis: raw counts, x-axis: exon number for GENE_SYMBOL
    # given TISSUES


    # These are the "Tableau 20" colors as RGB.
    tableau20 = [(31, 119, 180), (174, 199, 232), (255, 127, 14), (255, 187, 120),
                (44, 160, 44), (152, 223, 138), (214, 39, 40), (255, 152, 150),
                (148, 103, 189), (197, 176, 213), (140, 86, 75), (196, 156, 148),
                (227, 119, 194), (247, 182, 210), (127, 127, 127), (199, 199, 199),
                (188, 189, 34), (219, 219, 141), (23, 190, 207), (158, 218, 229)]
    # Scale the RGB values to the [0, 1] range, which is the format matplotlib
    # accepts.
    for i in range(len(tableau20)):
        r, g, b = tableau20[i]
        tableau20[i] = (r / 255., g / 255., b / 255.)

    num_of_exons = len(plotd[0]["mean"])

    fig, ax = plt.subplots()
    fig.set_size_inches((10, 10))

    width = 0.25

    ticks = []
    ind = np.empty(num_of_exons)

    for i, tissue in enumerate(plotd):
        ind = np.arange(len(tissue["mean"]))

        ax.bar(ind + width * i, tissue["mean"], width,
            color=tableau20[i % 20], yerr=tissue["stdev"])
        ticks = tissue["exon"]

    ax.set_title("Raw counts for {} given {}".format(
        GENE_SYMBOL, ",".join(TISSUES)))
    ax.set_ylabel("RNAseq exon raw counts")
    ax.set_xlabel("Exon number")

    plt.xticks(ind + width / 2, ticks)

    plt.show()


# subs = subsetBasedOnTissue(genedata, TISSUES)
# plotd = getDataForPlot(subs)

def getNext(reader):
    exon = reader.get_chunk()
    exon["ensemblGeneId"] = exon.apply(
        lambda row: row["Id"].split(".")[0], axis=1)
    return exon


def iterProcess():

    reader = pd.read_table(EXON_EXPR_DATA, chunksize=1)

    headers = pd.read_table(EXON_EXPR_DATA, nrows=1).columns
    one_gene = pd.DataFrame(columns=headers)


    prev_ensembl_id = ""
    cur_ensembl_id = ""

    line_num = 1

    while True:

        cur_row = pd.DataFrame()

        try:
            cur_row = getNext(reader)
        except(StopIteration):
            # process the last bit...
            processOne(one_gene)
            print("Successfully processed {} before EOF".format(prev_ensembl_id))
            print("stopping iteration...")
            break

        cur_ensembl_id = cur_row["ensemblGeneId"].iloc[0]

        # Here prev- and cur- ensembl id is correct
        if(prev_ensembl_id == "" or cur_ensembl_id == prev_ensembl_id):
            one_gene = one_gene.append(cur_row, ignore_index=True)
        else:
            # do processing on exon expression for one gene
            # releaase memory before starting on the next gene

            processOne(one_gene, line_num)
            print("Successfully processed {} at line {}".format(prev_ensembl_id, line_num))

            del one_gene
            one_gene = pd.DataFrame(columns=headers)
            one_gene = one_gene.append(cur_row, ignore_index=True)

        prev_ensembl_id = cur_ensembl_id
        cur_ensembl_id = None
        line_num += 1

if __name__ == "__main__":
    iterProcess()

