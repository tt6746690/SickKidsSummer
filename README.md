

## Planning 


+ [_GTEx_](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4010069/)
    + _abstract_ 
        + GWAS identify loci for common disease, mechanism remain unknown
        + most variants not in protein-coding region, 
            + suggests polymorphism in regulatory region likely contribute
        +  hence important to test gene expression and its relationship to genetic variantion
            + can look at cell context, which is a source of gene regulation 
        + However some types of tissues are difficult to sample 
            + Solution: GTex, database and tissue bank to study gene variation and gene expression in human tissues 
    + _definitions_ 
        + _quantitative trait_ 
            + phenotypes vary in degree attributable to polygenic effects, (i.e. product of two or more genes)
        + _quantitative trait locus (QTL)_
            +  a section of DNA (the locus) that _correlates_ with variation in a phenotype (the quantitative trait)
            + QTL is linked to genes that control that phenotype 
            + achieved by identifying SNP that correlate with an observed trait 
        + _expression quantitative trait locus (eQTL)_
            + genomic loci that contribute to variation in expression levels of mRNA
            + _local eQTLS_ 
                + cis-acting locus mapped to gene of origin 
            + _distant eQTLS_ 
                + trans-acting locus mapped far from location of gene of origin 
                + tissue-dependent
        + _reads per kilobase million (RPKM)_ 
            + a method of _quantifying gene expression_ from RNA sequencing data by normalizing for 
                + sample sequencing depth
                + gene length
            + [Mapping and quantifying mammalian transcriptomes by RNA-Seq.](https://www.ncbi.nlm.nih.gov/pubmed/18516045)
            + `RPKM = numReads / ( geneLength/1000 * totalNumReads/1,000,000 )`
    + _website_ 
        + Gene 
            + gene expression graph for each tissue (measured in RPKM)
            + exon expression for each tissue
                + collapsed transcript model 
                + ranked in order of expression
            + significant single-tissue eQTLs for each tissue
        + what is important?
        + display 
        + database 
            + about 57 Gb for everything 
            + 5Gb for expression only 

        

+ description 
    + goal 
        + gather data from gtex 
        + search for gene panel 
        + gene panel page display 
            + ranking of which tissues is best? 
                + express gene of interest (phenopredict)
                    + minimal level?
                    + just for detecting mutation
                + cover all exons interested 
                    + perhaps not the exact variant 
                    + but all exons of interested 
                    + minimal exons 
        + novel mutation study 
            +   
    + interface 
        + selection by panel 
    + definition 
        + panel 
            + a set of genes 
    + gtex 
        + 9000 samples over 30 tissue


## Todos 
 + _gene expression data_   
    + 50000genes x 53 tissue types 
    + not relevant 
+ _exon expression data_ 
    + 300000 exons x 9000 samples
        + samples has a mapping 
    + just group samples by tissue and infer if its significantly above a minimum threshold. 
    + exon id `.10_1` maybe different exon number on positive/negative strand
