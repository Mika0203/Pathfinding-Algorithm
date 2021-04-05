import { coordinates } from "./lib";
import MapInfo from "./MapInfo";
import Node from "./Node";

interface startResponse {
    isFind: boolean,
    findedNode?: Node,
    closedList?: Node[],
    openList?: Node[]
}

class Astar {
    private startPos: coordinates = { x: 0, y: 0 };
    private targetPos: coordinates = { x: 0, y: 0 };
    private calc = 0;

    private openlist: Array<Node> = [];
    private obstacles: Array<coordinates> = [];
    private closedlist: Array<Node> = [];

    private _isAllowDiagonal: boolean = true;
    private _isCanCrossCorner: boolean = true;

    set isAllowDiagonal(b: boolean) {
        this._isAllowDiagonal = b;
    }

    set isCanCorner(b: boolean) {
        this._isCanCrossCorner = b;
    }

    public start(mapInfo: MapInfo): startResponse {
        if (!mapInfo.startPos || !mapInfo.targetPos) {
            return {
                isFind: false
            };
        }

        const startTime = new Date();

        this.openlist = [];
        this.closedlist = [];
        this.obstacles = mapInfo.obstacles;
        this.startPos = mapInfo.startPos;
        this.targetPos = mapInfo.targetPos;
        this.calc = 1;

        let node: Node = new Node(this.startPos, undefined);
        this.openlist.push(node);

        while (true) {
            if (this.calc > 100000 || this.openlist.length === 0 || !node) {
                console.debug("can't find path..")
                return {
                    isFind: false
                };
            }

            if (this.targetPos.x === node.position.x
                && this.targetPos.y === node.position.y) {
                break;
            }

            this.calc++;
            this.closeNode(node);
            this.getAroundNodes(node);

            const result = this.getNextNode(node);
            if (result.isFind) {
                node = result.node;
            } else {
                console.debug("can't find path..")
                console.debug("can't find next node")
                return {
                    isFind: false
                };
            }
        }

        const endTime = new Date();
        let time = endTime.getTime() - startTime.getTime();

        console.log("Time : ", time);
        console.log("Calc : ", this.calc);

        return {
            isFind: true,
            findedNode: node,
            closedList: this.closedlist,
            openList: this.openlist
        };
    }

    private closeNode(node: Node) {
        const idx = this.openlist.indexOf(node)
        this.openlist.splice(idx, 1);
        this.closedlist.push(node);
    }

    private getNextNode(currentNode: Node): {
        node: Node,
        isFind: boolean
    } {
        let minH = Infinity;
        let minNode: Node = currentNode;
        let isFind = false;

        this.openlist.forEach(node => {
            if (node.f < minH) {
                minH = node.f;
                minNode = node;
                isFind = true;
            }
            // else if(node.h === minH){
            //     if(node.f)
            // }
        });

        return {
            node: minNode,
            isFind: isFind
        };
    }

    private getAroundNodes(node: Node) {
        const nodeList = [];

        nodeList.push(
            new Node({ x: node.position.x - 1, y: node.position.y }, node), // left
            new Node({ x: node.position.x, y: node.position.y - 1 }, node), // up
            new Node({ x: node.position.x + 1, y: node.position.y }, node), // right
            new Node({ x: node.position.x, y: node.position.y + 1 }, node) // down
        )

        if (this._isAllowDiagonal) {
            nodeList.push(
                new Node({ x: node.position.x + 1, y: node.position.y - 1 }, node),
                new Node({ x: node.position.x + 1, y: node.position.y + 1 }, node),
                new Node({ x: node.position.x - 1, y: node.position.y - 1 }, node),
                new Node({ x: node.position.x - 1, y: node.position.y + 1 }, node),
            )
        }

        nodeList.forEach(currentNode => {
            if (this.obstacles.findIndex(obstacle =>
                obstacle.x === currentNode.position.x && obstacle.y === currentNode.position.y) !== -1)
                return true;

            if (this.closedlist.findIndex(closeNode =>
                closeNode.position.x === currentNode.position.x && 
                closeNode.position.y === currentNode.position.y) !== -1) {
                return true;
            };

            if(!this._isCanCrossCorner && node.getDistance(currentNode.position) >= 20){
                const currentNodePosition = currentNode.position;
                const regacyNodePosition = node.position;

                const check1 : coordinates = {
                    x : currentNodePosition.x,
                    y : regacyNodePosition.y
                };

                const check2 : coordinates = {
                    x : regacyNodePosition.x,
                    y : currentNodePosition.y
                }

                const check1t = this.obstacles.findIndex(obstacle =>
                    obstacle.x === check1.x && obstacle.y === check1.y);

                const check2t = this.obstacles.findIndex(obstacle =>
                    obstacle.x === check2.x && obstacle.y === check2.y);

                if(check1t >= 0 && check2t >= 0){
                    return true;
                }
            }

            currentNode.getCost(this.targetPos);
            
            if (this.checkOpenList(currentNode))
                this.openlist.push(currentNode);
        });
    }

    private checkOpenList(currentNode: Node) {
        let findedNode = undefined;
        let idx: number = -1;

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