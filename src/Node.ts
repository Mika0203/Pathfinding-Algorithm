import { coordinates } from "./lib";

class Node {
    position : coordinates;
    parent : Node|undefined;

    f : number;
    g : number;
    h : number;

    constructor(coordinates : coordinates, parent : Node|undefined) {
        this.position = {
            x : coordinates.x,
            y : coordinates.y
        }

        this.parent = parent;

        let dist : number = 0;
        if (parent) {
            dist = Math.abs(parent.position.x - this.position.x) 
            + Math.abs(parent.position.y - this.position.y) === 1 ? 10 : 14
        }
        this.f = 0;
        this.h = 0;
        this.g = !parent ? 0 : parent.g + dist;
    }

    getCost(targetPosition : coordinates) {
        this.h = this.getDistance(targetPosition);
        this.f = this.g + this.h;
    }

    getDistance(targetPosition : coordinates) {
        return (Math.abs(targetPosition.x - this.position.x) 
        + Math.abs(targetPosition.y - this.position.y)) * 10;
    }

}

export default Node