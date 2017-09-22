
## Sickkidsproj 

> A web-based tool for finding similarly expressed (RNA) tissues  

--- 

#### `sickkidsproj` backend

+ _description_   
    + some analysis scripts that transform expression data
    + a flask server that servers data files 
+ _layout_  
    + `views.py`: handles routes, dispatch requests 
    + `config.py`: configures configurations for server
    + `cli.py`: configures command line utilities under flask 
    + `analysis/`: scripts for calculating ranking and data 
    + `data/`: symlinks to data 
    + `resources/`: symlinks to formatted data, after running some analysis scripts 
    + `database/`: contains models and related queries 
        + mapping between gene name to exon/gene expression data files on disk 
    + `cache/`: runtime in-memory constants
    + `utils/`: utility functions of various kinds
+ _dependencies_ 
    + `flask`
    + `SQLAlchemy`
    + `scipy`
    + `numpy`
+ _run_
    ```
    export FLASK_APP=sickkidsproj
    export FLASK_DEBUG=true
    python3 -m flask run
    ```

#### `static` frontend 

+ _description_ 
    + a React/Redux/Typescript web application 
    + generic structure on such application 
+ _layout_ 
    + `actions/`: Redux action types and action creators
    + `components/`: a pure (the intention) view layer with jsx 
    + `containers/`: Containers for components, inject functions/states to components 
    + `reducers/`: reducers that mutate states 
    + `store/`: a store of the global states
    + `utils/`: utility functions 
    + `interface.ts`: some simple typescript interfaces for state 
    + `index.ts`: entry point to application
+ _setup_ 
    ```
    npm install 
    ```
+ _run_ 
    ```
    tsc -w      // typescript compiler watch mode 
    webpack -w  // for compiling to es6 in watch mode 
    ```

---- 

+ __compute rpkm (DONE)__
    + changes to `exon_expr.py`
        + basically added this [part](https://github.com/tt6746690/SickKidsSummer/blob/master/analysis/exon_expr.py#L85)
    + submitted qsub job for generating jsons under `resources/exon_expr/`
        + qsub result `/hpf/projects/brudno/wangpeiq/sickkids_summer/analysis`
        + jobs finished and seems to be OK, stored under `/hpf/projects/brudno/wangpeiq/sickkids_summer/resources/exon_expr`
            + Note `exon_expr_old` was the previous data files
            + probably want to delete the old ones afterwards
+ __What to do next__ 
    + _git commit only genes related under gene panel_
        + Ideally, would want to transfer entire content perhaps with `scp` data generated from my hpf directory to `page`, but for now a subset would be OK i guess. 
        + go to hpf `/hpf/projects/brudno/wangpeiq/sickkids_summer/resources`
        + look over and use `./resources/subset` to `git add/push` ~100 files 
    + _Generate gene-level tissue Ranking_
        + probably a good idea to try it out locally
        + use `cli` command to compute tissueRanking (should work)
            + look under `sickkidsproj/cli.py` and `sickkidsproj/analysis/ranking.py`
    + _re-include experiment data_ 
        + use `cli` command to include experimenta data (should work)
            + + look under `sickkidsproj/cli.py` and `sickkidsproj/analysis/inc_data.py`
    + _probably a good idea to look at jsons generated along the way_
        + compare the data files under `resources/exon_expr_old` (reads in raw counts) with data files 
            + just generated under `resources/exon_expr` (reads in rpkm)
            + with gene-level tissueRanking computed 
    + _reload database with newly generated `exon_expr.mapping`_
        + have to use `resources/to_rel_path.py` to convert path to relative path
        + then use `cli` command to reload the database 