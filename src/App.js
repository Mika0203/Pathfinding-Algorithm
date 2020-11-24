import React from 'react';
import Board from './Board'

class App extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return <Board interval={30}/>
    }
}

export default App;