import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np
import mygene
import statistics
mg = mygene.MyGeneInfo ()


def plot_list(listt,name,x_axis,y_axis):
    data = np.array(listt)
    fig, ax = plt.subplots()
    heatmap = ax.pcolor(data)

    # Format
    fig = plt.gcf()
    fig.set_size_inches(30, 20)

    # turn off the frame
    ax.set_frame_on(False)

    # put the major ticks at the middle of each cell
    ax.set_yticks(np.arange(data.shape[0]) + 0.5, minor=False)
    ax.set_xticks(np.arange(data.shape[1]) + 0.5, minor=False)

    # want a more natural, table-like display
    ax.invert_yaxis()
    ax.xaxis.tick_top()

    # note I could have used nba_sort.columns but made "labels" instead
    ax.set_xticklabels(x_axis, minor=False)
    ax.set_yticklabels(y_axis, minor=False)

    # rotate the
    plt.xticks(rotation=90)

    ax.grid(False)

    # Turn off all the ticks
    ax = plt.gca()

    for t in ax.xaxis.get_major_ticks():
        t.tick1On = False
        t.tick2On = False
    for t in ax.yaxis.get_major_ticks():
        t.tick1On = False
        t.tick2On = False


    plt.colorbar(heatmap)
    plt.tight_layout()
    #plt.show()
    plt.savefig(name+".png",dpi=400)

fle=open ("Congenital Myasthenic Myopathies.txt","r")
ln2 =[]
for line in fle:
    l= line.strip().split (',')
for x in l:
    ln2.append (x.upper().strip())
fle.close ()



infile = open('dict.txt', 'r')
per=[]
for line in infile:
    new_ln=line.strip().split('\t')
    per.append(new_ln)
perc= list (zip(*per))
infile.close ()

per_row1 =[]
fp = open("all.txt")
for i, line in enumerate(fp):
    print (i)
    new_ln=line.strip().split('\t')

    if i ==0:
        per_row1.append (new_ln)
    else:
        if i>= 26291 and i<=26320:

            test=[new_ln]
            x = test [0][0]
            v = x.replace('_','.').split('.')
            g = mg.getgene(v[0])
            if g != None:
                if type (g) == dict:
                    print g['symbol']
                    #if g['symbol'] in ln2:
                    per_row1.append (new_ln)
        if i>= 26400:
            break

infile.close()




print per_row1
print ("The number of exons in cogenital myopathies are:" +str (len (per_row1)-1))
final_list=[]
final_list.append (per_row1)


per_column = list (zip(*per_row1))
# the id
identity = per_column.pop(0)
#removed "id"
identity = identity [1:]

samples =[]
#all the smaples
nc =[]
for x in per_column:
    y =list (x)
    #sample names
    samples.append (y.pop(0))
    #data
    nc.append (y)
    #print (nc)

tissue =[]
#print nc
#converts samples to tissues
for x in samples:
    for y in range (len (perc[0])):
        if x == perc[0][y]:
            tissue.append ( perc[6][y])
#gets how many tissues are there of each kind

ct = [[x,tissue.count(x)] for x in set(tissue)]


tissueFinal=[]
per_columnFinal=[]
#tissue represents all the 8557 samples
for x in tissue:
    val=[]
    if x not in tissueFinal:
        tissueFinal.append (x)
        for count in range (len (nc[0])):
            c=[]
            for y in range ( len (nc)):
                if tissue [y]== x:
                    c.append (float (nc[y][count]))
            c.sort ()
            val.append (statistics.median(c))
        per_columnFinal.append (val)



count = 0

for x in tissue:
    if x not in tissueFinal:

        tissueFinal.append (x)

        per_columnFinal.append (nc[count])

    else:
        loc = tissueFinal.index (x)

        val = map (float, per_columnFinal [loc])
        val1 = map (float, nc [count])
        c = [(x+y) for x,y in zip(val, val1)]

        per_columnFinal [loc]= c
    count += 1




per_columnFinal1 = per_columnFinal [:]
#gets the final list of tissues (53), puts the order so we can divide accordingly
od =[]


for x in tissueFinal:
    for y in ct:
        if x == y[0]:
            od.append (y[1])


per_columnFinal1=[]
count=0
for x in per_columnFinal:
    val=[]
    for z in x:
        val.append ( z/od[count])
    per_columnFinal1.append (val)
    count+=1






geneList = []
ref=[]
fp = open ('ExonReference.txt')
for h, line in enumerate (fp):
    if h != 0:
        new_ln=line.strip().split('\t')
        ref.append(new_ln)

checklst =[]
for z in identity:
    print "the identiy "
    print z
    v = z.replace('_','.').split('.')
    if v[0] not in checklst:
        i = mg.getgene(v[0])
        num= 0
        num_final=[]
        lst =[]
        count =1
        for x in ref:
            for y in x:
                if (v[0]) in y:
                    ind = (x[4])
                    count+=1
        print "ind"
        print ind
        rec = count
        tst1 = v[2]
        tst = int (tst1) +1
        if '-' == ind:
            print "afgdfasdf"
            print rec
            print tst

            num = rec - int (tst)
        else:
            num= int (tst)

        gene = i['symbol']+"."+v[1]+"_"+str (abs (num))
        geneList.append (gene)
        print "genelist"
        print geneList




overall2=[]
for z in per_columnFinal1:
    new=[]
    for y in z:
        if y >=20:
            new.append(20)
        else:
            new.append(10)
    overall2.append (new)

print "overall2"
print overall2
print "overall2[:][-1]"
print geneList

stats = []
data_final =overall2[:]
for y in data_final:
    count = 0.0
    for x in y:
        if x >=20:
            count= count +1
    count1 = count/len (geneList) *100
    stats.append (format (count1,'.2f'))

for x in range (len(tissueFinal)):
    print (str(tissueFinal[x]))
for x in range (len (tissueFinal)):
    print (str (stats[x] ))

nm ='Cogenital Myopathies'
test=[]
count=0
count1=100
name=1
lngth =  len (overall2 [0])

while (count <lngth):
    del test[:]
    if (lngth -count) <=100:
        for y in range (len (overall2)):
            test.append(overall2[y][count:])
        print ("final plot")
        plot_list (test,nm+str (name),geneList[count:],tissueFinal)
        break ;
    else:
        for y in range (len (overall2)):
            test.append(overall2[y][count:count1])
        print ("plot")
        plot_list (test,nm+str(name),geneList[count:count1],tissueFinal)
    count+=100
    count1+=100
    name+=1
