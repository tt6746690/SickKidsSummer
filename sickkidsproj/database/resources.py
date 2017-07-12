import os
import re

from sickkidsproj import app, db
from sickkidsproj.utils.check import isEnsemblId
from sickkidsproj.cache.g import OPTION_EXONEXPR, OPTION_GENEEXPR, OPTION_GENEPANELS, EXT_INC, EXT_TEN, EXT_TWENTY


def traverse_resources_dir(option):
    """ Traverses resources given by option
        @param dirp str
    """

    dirp = ""

    if option == OPTION_EXONEXPR:
        dirp = app.config["EXON_EXPR_DIR"]
    elif option == OPTION_GENEEXPR:
        dirp = app.config["GENE_EXPR_DIR"]
    elif option == OPTION_GENEPANELS:
        dirp = app.config["GENE_PANEL_DIR"]

    firsttime = True
    for root, dirs, files in os.walk(dirp, topdown=True):
        if firsttime:
            firsttime = False
            continue

        yield root, files


def inspect_resources(option = OPTION_EXONEXPR):
    """ Inspects resources directory
        -- exon_expr/
        -- gene_expr/
        -- gene_panels/
        and reports some summary stats
        
        @param option enum
    """
    
    ensembl_id_count = 0
    for root, files in traverse_resources_dir(option):

        print("indexed directory {}:".format(root.split('/')[-1]))
        extensions = {}

        for f in files:

            f_noext, ext = os.path.splitext(f)
            assert(isEnsemblId(f_noext)), "Invalid ensembl id [{}]".format(f_noext)

            if ext is not "":
                if f_noext not in extensions:
                    extensions[f_noext] = {}
                if ext not in extensions[f_noext]:
                    extensions[f_noext][ext] = 0
                extensions[f_noext][ext] += 1

        for filename, exts_count in extensions.items():
            print("\t{}".format(filename))
            for ext, ext_count in exts_count.items():
                print("\t\t{} : {}".format(ext, ext_count))

            ensembl_id_count += 1

    print("=== Inspecting {} ===".format(option))
    print("Total number of genes:\t{}".format(ensembl_id_count))



def delete_fendswith(option = OPTION_EXONEXPR, ext = EXT_TWENTY):
    """ Delete all files located in directory specified with option 
        and ends with ext
        
        @param option enum 
        @param ext enum
    """

    assert(ext != "")
    for root, files in traverse_resources_dir(option):
        for f in files:
            if f.endswith("." + ext):
                remove_fp = os.path.join(root, f)
                os.remove(remove_fp)
                print("Deleting file {}".format(f))




    
            


    


    

    
    

