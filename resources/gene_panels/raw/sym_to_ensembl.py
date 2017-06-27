
import os
import mygene 
mg = mygene.MyGeneInfo()

PANELS = ["neuropathy.txt", "channelopathies.txt", "congenital_myasthenic_syndromes.txt", "distal_myopathies.txt", "muscular_dystrophies.txt", "vacuolar_and_others.txt", "limb_girdle_dystrophies.txt", "congenital_myopathy.txt", "congenital_muscular_dystrophies.txt"]

def sym_to_ensembl(sym_fp, out_fp):
    """ Takes comma seperated list of gene symbol at sym_fp
    and write the corresponding ensembl id to out_fp
    Returns a list of genes not found 

    @param str sym_fp: symbol file path
    @param str out_fp: output file path
    @Rtype [str]: a list of genes not found
    """
    print("processing {}".format(sym_fp))

    not_found = []
    with open(sym_fp, "r") as inf:
        with open(out_fp, "w+") as outf:

            line = inf.read()

            symbols = []
            symbols = line.split(', ')


            lines = ""

            CHUNK_SIZE = 10
            for i in range(0, len(symbols), CHUNK_SIZE):
                query = mg.getgenes(symbols[i: i + CHUNK_SIZE], species='human', scopes='symbol', fields=['ensembl.gene'])
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
    for p in PANELS:
        outfp = os.path.splitext(p)[0]
        sym_to_ensembl(p, outfp)



