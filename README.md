
## Sickkidsproj 

> A web-based tool for finding similarly expressed (RNA) tissues  


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
    ```sh 
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
    ```sh 
    npm install 
    ```
+ _run_ 
    ```sh
    tsc -w      // typescript compiler watch mode 
    ```
    ```sh 
    webpack -w  // for compiling to es6 in watch mode 
    ```
