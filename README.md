

gencode.v19.genes.patched_contigs_exons.txt -> 312883
gencode from above that doesnt match to any ENSE id -> 168104

10-1-M: unique start, end, ense, data in experimental data -> 316579
exon_pos_id.mapping: unique start,end pair in ense -> 269129

# Problem 

+ Given 
    + a set of genes `P = { g_1, g_2, ..., g_n }`, 
        + `g_i = { (e_1, abv_1), ..., (e_m, abv_m) }` is  a set of exons, `m` varies.
        + `abv_j` is a boolean value indicating if `e_m` RNA expression is above the threshold read count
    + that is specific to the given reference tissueSite `T`
    + Conceptually, `T` is a function `T: e_j -> abv_j`
+ Goal 
    + find another tissueSite `T'` such that each `g_i' \in P` is optimized, 
    + here we define an optimal solution for `e_j`
        + if `T(e_j)` is true, then `T'(e_j)`  is also true 
        + if `T(e_j)` is false, then `T'(e_j)` could be either true or false
    + now we define an optimal solution for `g_i`
        + Approach 
            + Do not assume perfect score for `T'`, 
                + `T` and `T'` are equivalent in a sense that the reference tissueSite is now `T_r`, where `T_r: e_j -> true`
                + So for every `T`, we compute `score`
                    + Define `total(T_r, g_i) = g_i` 
                    + Define `sub(T_r, T, g_i) = {e_j \in g_i: T(e_j) == true}`  
                    + similarly we pick a score described above
                        + `score = |sub|`
                        + `score = |sub| / |total|`
                + comparison
                    + This approach is more of which tissueSite offers the best expression level for detection, regardless of the original target for gene panel. One problem with this approach is that the given `T` is not taken into account, so if `T` and `T'` have the same ranking, their underlying expression at exon level may be different hence not really applicable 
            + Assume perfect score for `T` and just find the best `T'`.
                + ignore cases where `T(e_j)` is false, so 
                + Define `total(T, g_i) = {e_j \in g_i: T(e_j) == true}` 
                    + gene = [...{exonNum, overthreshold}]
                + Define `sub(T, T', g_i) = {e_j \in g_i: T'(e_j) == true && T(e_j) == true}`
                + different ways of representing the ranking 
                    + _by counts_: Maximize `score(g_i, T) = |sub|`. This may be problematic since genes have different number of exons; there may be cases where a `g_1` with 100 exons 50 of them over threashold and the other `g_2` 10 exon all of them overthreshold. If rank by counts, then `g_2` would be ranked lower than `g_1`
                    + _by scaled counts_: Maximize `score(g_i, T) = |sub| / |total|`. The above problem is solved, but doesnt represent the entire picture, say `g_2'` 10 exons 5 over threshold. Both `g_1` and `g_2'` have same scaled counts but `g_1` has 5 times more exon over threshold
                    + a tradeoff, which one is more important? some alternative solutions 
            + combine the previous 2 approaches?
                + rationale 
                    + Being same with the reference tissueSite `T` is more important than `T(e_j) == false && T'(e_j) == true` (i.e. exon in `T'` is expressed over threshold while exon in `T` does not)
                + for each every `T'`, we compute `score` for each gene
                    + `score(g_i, T') = c_1|{e_j \in g_i: T(e_j) == false && T'(e_j) == true}| + c_2|{e_j \in g_i: T(e_j) == true && T'(e_j) == true}|`, where `c_1 < c_2`
                    + could be scaled by total by `c_3|g_i|` but then the problem is what coeffcient `c_3` should be
                + discussion 
                    + how to decide what to choose for `c_1`, `c_2`, 
                    + are they same cross genes? gene panels? 
                    + still does not take into account relative importance of exons... 
    + now we define an optimal solution for `P`
        + hard to say, no obvious way to quantify a set of genes, each having different number of exons, and perhaps of different contribution to the overall fitness. 
        + possible solution
            + plot the tissueSite ranking for each gene in the panel, assuming previous definition of optimality at the gene level
            + develop some _rules_ to quantify the ranking 
                + mean of `score` for each gene ?



