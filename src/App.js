import React from 'react';
import Board from './Board';
import UI from './UI';
import Astar from './Astar';
import MapInfo from './MapInfo';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapInfo: new MapInfo(),
            interval: 30,
            searched : undefined
        }
        this.Astar = new Astar();
        this.startSearch = this.startSearch.bind(this);
        this.setMapSize = this.setMapSize.bind(this);
    }

    setMapSize(e) {
        let value = e.target.value;
        console.log(value)
        this.setState({
            interval: parseInt(value)
        })
    }

    render() {
        return <>
            <UI
                startSearch={this.startSearch}
                mapInfo={this.state.mapInfo}
                interval={this.state.interval}
                setMapSize={this.setMapSize} />
            <Board
                searched={this.state.searched}
                mapInfo={this.state.mapInfo}
                interval={this.state.interval} />
        </>
    }

    startSearch() {
        let find = this.Astar.start(
            this.state.mapInfo.startPos,
            this.state.mapInfo.targetPos,
            this.state.mapInfo.obstacles);
        this.setState({
            searched : find
        })
    }
}

export default App;