
# coding: utf-8

# In[2]:

import pandas as pd
import matplotlib.pyplot as plt

GTEX_GENE_EXPRESSION = "../data/GTEx_Analysis_v6p_RNA-seq_RNA-SeQCv1.1.8_gene_reads.gct"
BIOBANK_COLLECTION="../data/biobank_collection_20170515_012734.txt"


# In[44]:

# ref = pd.read_table(BIOBANK_COLLECTION, nrows=20)
ref = pd.read_table(BIOBANK_COLLECTION)

# Format Id to match gene expression table column names
def getId(row):
    """Converts GTEX-N7MS-0011-R1a-SM-1UOYX to GTEX-N7MS-0011-SM-1UOYX"""
    id = row["sampleId"].split("-")
    return "-".join(id[:3] + id[4:])

ref["Id"] = ref.apply(getId, axis=1)
ref[["sampleId", "Id"]]


# In[45]:

list(ref.columns.values)


# In[54]:

usefulCol = ["Id", "tissueSite", "tissueSiteDetail", "materialType","subjectId"]
for col in usefulCol:
    uniq = ref[col].unique()
    print(uniq)
    print(len(uniq))


# In[52]:

f = ref.loc[
    (ref["tissueSampleId"] == "GTEX-111CU-1826")
]
# filtered[usefulCol]
f


# 

# In[29]:

df = pd.read_table(GTEX_GENE_EXPRESSION, skiprows=2, nrows=10)
df



# In[ ]:



