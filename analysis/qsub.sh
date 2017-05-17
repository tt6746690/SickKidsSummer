# qsub -W umask=0002 -W group_list=brudno -l vmem=20g,mem=20g
export PYTHONPATH=/hpf/projects/brudno/wangpeiq/sickkids_summer/analysis/:PYTHONPATH
module load python/3.5.2 
python /hpf/projects/brudno/wangpeiq/sickkids_summer/analysis/exon_expr.py
