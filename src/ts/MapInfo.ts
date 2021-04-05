import { coordinates } from "./lib";

class MapInfo {
    private _startPos : coordinates|undefined = undefined;
    private _targetPos : coordinates|undefined = undefined;
    private _obstacles : Array<coordinates> = [];

    get startPos() : coordinates|undefined {
        return this._startPos;
    };

    set startPos(newPos : coordinates|undefined) {
        this._startPos = newPos;
    };

    get targetPos() : coordinates|undefined {
        return this._targetPos;
    };

    set targetPos(newPos : coordinates|undefined) {
        this._targetPos = newPos;
    };

    get obstacles() : Array<coordinates>{
        return this._obstacles;
    };

    set obstacles(newArr : Array<coordinates>) {
        this._obstacles = newArr;
    };


    isThisObstacle = (coordinates : coordinates) =>{
        return this._obstacles.findIndex(e => e.x === coordinates.x && e.y === coordinates.y) === -1 ? false : true;
    }

    isThisStartPos = (coordinates : coordinates) =>{
        if(!this.startPos)
            return false;
        return this.startPos.x === coordinates.x 
        && this.startPos.y === coordinates.y;
    }

    isThisTargetPos = (coordinates : coordinates) =>{
        if(!this.targetPos)
            return false;
        return this.targetPos.y === coordinates.x 
        && this.targetPos.y === coordinates.y;
    }

    addObstacle(coordinates : coordinates){
        this._obstacles.push(coordinates)
    }

    removeObstacle(coordinates : coordinates){
        this._obstacles = this._obstacles.filter(e => !(e.x === coordinates.x && e.y === coordinates.y));
    }

    removeAllObstacles(){
        this._obstacles.length = 0;
    }
}

export default MapInfo