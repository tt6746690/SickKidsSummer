import pandas as pd 
import matplotlib.pyplot as plt
import os
import json


WD="/hpf/projects/brudno/wangpeiq/sickkids_summer/"
#  WD = "../"
GTEX_GENE_EXPRESSION = WD + "data/GTEx_Analysis_v6_RNA-seq_RNA-SeQCv1.1.8_gene_reads.gct"
GTEX_GENE_RPKM = WD + "data/GTEx_Analysis_v6_RNA-seq_RNA-SeQCv1.1.8_gene_rpkm.gct"
SAMPLE_ANNOTATION = WD + "data/annotation/GTEx_Data_V6_Annotations_SampleAttributesDS.txt"

DEST_STORE = WD + "resources/gene_expr/"
STORAGE_MAPPING = WD + "resources/gene_expr.mapping"

sample_anno = pd.read_table(SAMPLE_ANNOTATION)
sample_anno = sample_anno[["SAMPID", "SMTSD"]]


def processOne(reader, line_num):
    """Process one gene at a time 
        @param table reader 
        @param line_num int
        @rType {ensemblId: { ..., tissueSite: [ ...rpkm ]}} 
    """
    df = reader.get_chunk()


    df["ensemblGeneId"] = df.apply(
        lambda x: x["Name"].split(".")[0], axis=1)
    geneId = df["ensemblGeneId"].iloc[0]
    df = df.drop(["Description", "Name"], axis=1)     
    
    # Transpose to 8000X2 matrix, 
    # with sampleId, rpkm for a single gene as columns
    df_t = df.transpose()
    df_t.columns = ["rpkm"]
    df_t.index.name = "SAMPID"
    df_t = df_t.reset_index()
    
    
    # merge sample annotation with expression data on key=SAMPID
    df_m = df_t.merge(sample_anno, on='SAMPID').set_index("SMTSD").drop(["SAMPID"], axis=1)
    
    rpkmByTissueSite = df_m.groupby(df_m.index)["rpkm"].apply(lambda x: list(x)).to_dict()
    
    dir_path = os.path.join(DEST_STORE, str(line_num % 200))
    full_path = os.path.join(dir_path, geneId)
    rel_path = "/".join(full_path.split('/')[-3:])
    print(rel_path)
        
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    
    with open(full_path, "w") as fp:
        json.dump(rpkmByTissueSite, fp)
    
    with open(STORAGE_MAPPING, "a") as fp:
        fp.write(geneId + '\t' + rel_path + '\n')
        
    print("processed line {} at line {}".format(geneId, line_num))

                 
    del df_m
    del df_t
    del df
                 
    
def iterProcess():
    reader = pd.read_table(GTEX_GENE_RPKM, skiprows=2, chunksize=1)
            
    line_num = 1
    while True:        
        try:
            processOne(reader, line_num)
            
        except(StopIteration):
            print("finished processing...")
            break
        line_num += 1
        

if __name__ == '__main__':
    print("starting...")
    iterProcess()


