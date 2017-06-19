
with open('exon_expr.mapping', 'r') as inf:
    with open('exon_expr.mapping.rel', 'w+') as outf:
        for line in inf:
            l = line.strip().split('\t')

            id = l[0]

            p = l[1].split('/')
            path = '/'.join(p[7:])

            outline = '\t'.join([id, path])
            outline += '\n'
            outf.write(outline)
