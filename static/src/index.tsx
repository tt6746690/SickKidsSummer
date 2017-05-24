import * as React from "react"
import * as ReactDOM from "react-dom"

import GenePanelList from "./components/GenePanelList"


let gene_panel_list = [
    "congenital_myasthenic_myopathies",
    "congenital_myopathy_dystrophy",
    "congenital_myasthenic_myopathies"
]
let gene_panel = [
    {
        "ensembl_id": "ENSG00000138435",
        "symbol": "CHRNA1"
    },
    {
        "ensembl_id": "ENSG00000170175",
        "symbol": "CHRNB1"
    },
    {
        "ensembl_id": "ENSG00000135902",
        "symbol": "CHRND"
    },
    {
        "ensembl_id": "ENSG00000108556",
        "symbol": "CHRNE"
    },
    {
        "ensembl_id": "ENSG00000129749",
        "symbol": "CHRNA10"
    },
    {
        "ensembl_id": "ENSG00000165917",
        "symbol": "RAPSN"
    },
    {
        "ensembl_id": "ENSG00000070748",
        "symbol": "CHAT"
    },
    {
        "ensembl_id": "ENSG00000206561",
        "symbol": "COLQ"
    },
    {
        "ensembl_id": "ENSG00000030304",
        "symbol": "MUSK"
    },
    {
        "ensembl_id": "ENSG00000175920",
        "symbol": "DOK7"
    },
    {
        "ensembl_id": "ENSG00000188157",
        "symbol": "AGRN"
    },
    {
        "ensembl_id": "ENSG00000198380",
        "symbol": "GFPT1"
    },
    {
        "ensembl_id": "ENSG00000196730",
        "symbol": "DAPK1"
    },
    {
        "ensembl_id": "ENSG00000172037",
        "symbol": "LAMB2"
    },
    {
        "ensembl_id": "ENSG00000007314",
        "symbol": "SCN4A"
    },
    {
        "ensembl_id": "ENSG00000196811",
        "symbol": "CHRNG"
    },
    {
        "ensembl_id": "ENSG00000178209",
        "symbol": "PLEC"
    },
    {
        "ensembl_id": "ENSG00000119523",
        "symbol": "ALG2"
    },
    {
        "ensembl_id": "ENSG00000172339",
        "symbol": "ALG14"
    },
    {
        "ensembl_id": "ENSG00000143858",
        "symbol": "SYT2"
    },
    {
        "ensembl_id": "ENSG00000138078",
        "symbol": "PREPL"
    }
]



ReactDOM.render(
    <GenePanelList panelList={gene_panel_list} />,
    document.getElementById('root')
)

   