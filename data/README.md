
# Directory structure


```sh 
.
├── GenesRPKM.txt
├── README.md
├── annotation
│   ├── GTEx_Data_V6_Annotations_SampleAttributesDD.xlsx
│   ├── GTEx_Data_V6_Annotations_SampleAttributesDS.txt
│   ├── GTEx_Data_V6_Annotations_SubjectPhenotypesDS.txt
│   └── GTEx_Data_V6_Annotations_SubjectPhenotypes_DD.xlsx
├── gencode.v19.genes.patched_contigs_exons.txt                 
└── gene_panels
    ├── Congenital\ Myasthenic\ Myopathies.txt
    ├── Congenital\ Myopathies.txt
    ├── Congential\ Muscular\ Dystrophies.txt
    ├── README.md
    ├── congenital_myasthenic_myopathies.ensembl
    ├── congenital_myopathy.ensembl
    ├── congenital_myopathy_dystrophy.ensembl
    └── sym_to_ensembl.py
```


+ `GenesRPKM.txt`
    + averaged (over all exons) normalized read counts in rpkm for gene expression
+ `gencode.v19.genes.patched_contigs_exons.txt`
    + ensembl id for exons mapped to chr location, and +/- strand 
    + for determining enumeration of exons
+ `./gene_panels`
    + a list of gene panels in gene symbols (`.txt`)
    + converted to ensembl id (`.ensembl`)

