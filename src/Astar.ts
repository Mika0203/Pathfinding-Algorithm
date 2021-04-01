import { coordinates } from "./lib";
import Node from "./Node";

class Astar {
    startPos : coordinates = {x : 0, y : 0};
    targetPos : coordinates = {x : 0, y : 0};
    calc = 0;

    openlist : Array<Node> = [];
    obstacles : Array<coordinates> = [];
    closedlist : Array<Node> = [];

    start(start : coordinates, 
        target : coordinates, 
        obstacles : Array<coordinates>) {
        const startTime = new Date();

        this.openlist = [];
        this.closedlist = [];
        this.obstacles = obstacles;

        this.startPos = start;
        this.targetPos = target;
        this.calc = 1;

        let node : Node|undefined = new Node(start, undefined);
        this.openlist.push(node);

        while (true) {
            if (this.calc > 100000 || this.openlist.length === 0 || !node) {
                console.log("can't find..")
                return null;
            }

            if (target.x === node.position.x 
                && target.y === node.position.y) {
                break;
            }

            this.calc++;
            this.closeNode(node);
            this.getAroundNodes(node);
            node = this.getNextNode(node);
        }

        const endTime = new Date();
        let time = endTime.getTime() - startTime.getTime();

        console.log("Time : ", time);
        console.log("Calc : ", this.calc);

        return {
            findedNode: node,
            closedList: this.closedlist,
            openList: this.openlist
        }
            ;

    }

    closeNode(node : Node) {
        const idx = this.openlist.indexOf(node)
        this.openlist.splice(idx, 1);
        this.closedlist.push(node);
    }

    getNextNode(currentNode : Node) : Node|undefined {
        let minH = Infinity;
        let minNode : Node|undefined = undefined;

        this.openlist.forEach(node => {
            if (node.f < minH) {
                minH = node.f;
                minNode = node;
            }
            // else if(node.h === minH){
            //     if(node.f)
            // }
        });
        return minNode;
    }

    getAroundNodes(node : Node) {
        let nodeList = [];

        nodeList.push(
            new Node({x : node.position.x - 1, y : node.position.y}, node),
            new Node({x : node.position.x, y : node.position.y - 1}, node),
            new Node({x : node.position.x + 1, y : node.position.y}, node),
            new Node({x : node.position.x, y : node.position.y}, node),

            new Node({x : node.position.x + 1, y : node.position.y - 1}, node),
            new Node({x : node.position.x + 1, y : node.position.y + 1}, node),
            new Node({x : node.position.x - 1, y : node.position.y - 1}, node),
            new Node({x : node.position.x - 1, y : node.position.y + 1}, node),
        )

        nodeList.forEach(node => {
            if (this.obstacles.findIndex(e => e.x === node.position.x && e.y === node.position.y) !== -1)
                return true;

            if (this.closedlist.findIndex(e => e.position.x === node.position.x && e.position.y === node.position.y) !== -1) {
                return true;
            }
            node.getCost(this.targetPos);
            if (this.checkOpenList(node))
                this.openlist.push(node);
        });
    }

    checkOpenList(currentNode : Node) {
        let findedNode = undefined;
        let idx : number = -1;

        for (let i in this.openlist) {
            let node = this.openlist[i];
            if (node.position.x === currentNode.position.x 
                && node.position.y === currentNode.position.y) {
                findedNode = node;
                idx = parseInt(i);
                break;
            }
        };

        if (findedNode) {
            if (findedNode.g > currentNode.g) {
                this.openlist[idx] = currentNode;
            }
            return false;
        }
        else {
            return true;
        }


    }
}

export default Astar