
import mygene 
mg = mygene.MyGeneInfo()


CONGENITAL_MYOPATHY = "./Congenital Myopathies.txt"
CONGENITAL_MYOPATHY_OUT = "./congenital_myopathy"

CONGENITAL_MUSCULAR_DYSTROPHY = "./Congential Muscular Dystrophies.txt"
CONGENITAL_MUSCULAR_DYSTROPHY_OUT = "./congenital_myopathy_dystrophy"

CONGENITAL_MYASTHENIC_MYOPATHY = "./Congenital Myasthenic Myopathies.txt"
CONGENITAL_MYASTHENIC_MYOPATHY_OUT = "./congenital_myasthenic_myopathies"


def sym_to_ensembl(sym_fp, out_fp):
    """ Takes comma seperated list of gene symbol at sym_fp
    and write the corresponding ensembl id to out_fp
    Returns a list of genes not found 

    @param str sym_fp: symbol file path
    @param str out_fp: output file path
    @Rtype [str]: a list of genes not found
    """

    not_found = []
    with open(sym_fp, "r") as inf:
        with open(out_fp, "w+") as outf:

            line = inf.read()

            symbols = []
            symbols = line.split(', ')
            
            query = mg.getgenes(symbols, species='human', scopes='symbol', fields=['ensembl.gene'])

            lines = ""
            for q in query:
                if 'notfound'in q or 'ensembl' not in q:
                    not_found.append(q['query'])
                else:
                    if isinstance(q['ensembl'], list):
                        ensembl_id = '\t'.join(g['gene'] for g in q['ensembl'])
                    else:
                        ensembl_id = q['ensembl']['gene']
                    lines += "{}\t{}\n".format(q["query"], ensembl_id)
            outf.write(lines)

    return not_found




if __name__ == '__main__':
    nf = sym_to_ensembl(CONGENITAL_MYOPATHY, CONGENITAL_MYOPATHY_OUT)
    print("Genes for {} unfound -> {}".format(CONGENITAL_MYOPATHY, ', '.join(nf)))

    nf = sym_to_ensembl(CONGENITAL_MUSCULAR_DYSTROPHY, CONGENITAL_MUSCULAR_DYSTROPHY_OUT)
    print("Genes for {} unfound -> {}".format(CONGENITAL_MUSCULAR_DYSTROPHY, ', '.join(nf)))
            
    nf = sym_to_ensembl(CONGENITAL_MYASTHENIC_MYOPATHY, CONGENITAL_MYASTHENIC_MYOPATHY_OUT)
    print("Genes for {} unfound -> {}".format(CONGENITAL_MYASTHENIC_MYOPATHY, ', '.join(nf)))

