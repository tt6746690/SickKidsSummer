
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
    + gene expression data
    + 50000 genes x 53 tissue types 
    + averaged (over all exons) normalized read counts in rpkm for gene expression
    + _collection summary_
        + 71476 x 12 (headers)
        + headers
            + 71476 `sampleId`: `GTEX-111CU-1826-SM-5GZYN`
                + `GTEX-111cU`: donor ID
                    + link Rnaseq to genotype 
                + `1826`: tissue site
                + `SM-5GZYN`: RNA aliquot ID for sequencing
            + 959 `subjectId`
            + 6 `materialType`
                + interested in `RNA:Total RNA` and perhaps `DNA:DNA Genomic`
            + 30 distinct `tisueSite`
            + 53 distinct `tissueSiteDetail`
+ `gencode.v19.genes.patched_contigs_exons.txt`
    + ensembl id for exons mapped to chr location, and +/- strand 
    + for determining enumeration of exons
+ `./gene_panels`
    + a list of gene panels in gene symbols (`.txt`)
    + converted to ensembl id (`.ensembl`)
+ `./annotation`
    + `GTEx_Data_V6_Annotations_SampleAttributesDS.txt` 
        + `SubjectId`, i.e. `GTEX-1117F`
        + `AGE`
        + `GENDER`
        + ...
    + `GTEx_Data_V6_Annotations_SubjectPhenotypesDS.txt`
        + `SubjectId`, i.e. `GTEX-1117F`
        + `AGE`
        + `GENDER`
        + ...
+ _exon expression data_
    + 300000 exons x 8556 samples
    + data unnormalized. 
        + If a read overlapped multiple exons, then a fractional value equal to the portion of read contained within that exon was allotted


