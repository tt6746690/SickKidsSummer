import * as React from "react"
import * as ReactDOM from "react-dom"

import { Jumbotron, Grid } from 'react-bootstrap';

import GenePanel from "./GenePanel"


const App = (
    <Jumbotron>
        <Grid> 
            <GenePanel/>
        </Grid> 
    </Jumbotron>
)

export default App