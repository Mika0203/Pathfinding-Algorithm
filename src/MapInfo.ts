import { coordinates } from "./lib";

class MapInfo {
    startPos : coordinates|undefined = undefined;
    targetPos : coordinates|undefined = undefined;
    obstacles : Array<coordinates> = [];

    isThisObstacle = (coordinates : coordinates) =>{
        return this.obstacles.findIndex(e => e.x === coordinates.x && e.y === coordinates.y) === -1 ? false : true;
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

    setStartPos(coordinates : coordinates){
        this.startPos = coordinates; 
    }

    setTargetPos(coordinates : coordinates){
        this.targetPos = coordinates;
    }

    setObstacle(coordinates : coordinates){
        this.obstacles.push(coordinates)
    }

    removeObstacle(coordinates : coordinates){
        this.obstacles = this.obstacles.filter(e => !(e.x === coordinates.x && e.y === coordinates.y));
    }

    removeAllObstacles(){
        this.obstacles = [];
    }
}

export default MapInfo