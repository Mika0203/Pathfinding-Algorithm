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

    private _isCanCross: boolean = true;
    private _isCanCorner: boolean = true;

    set isCanCross(b: boolean) {
        this._isCanCross = b;
    }

    set isCanCorner(b: boolean) {
        this._isCanCorner = b;
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
                const dist = currentNode.getDistance(node.position)
                if(this.isCanCorner && dist >= 20){
                    return true;
                }
                console.log(dist);
                
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
        let nodeList = [];

        nodeList.push(
            new Node({ x: node.position.x - 1, y: node.position.y }, node), // left
            new Node({ x: node.position.x, y: node.position.y - 1 }, node), // up
            new Node({ x: node.position.x + 1, y: node.position.y }, node), // right
            new Node({ x: node.position.x, y: node.position.y + 1 }, node) // down
        )

        if (this._isCanCross) {
            nodeList.push(
                new Node({ x: node.position.x + 1, y: node.position.y - 1 }, node),
                new Node({ x: node.position.x + 1, y: node.position.y + 1 }, node),
                new Node({ x: node.position.x - 1, y: node.position.y - 1 }, node),
                new Node({ x: node.position.x - 1, y: node.position.y + 1 }, node),
            )
        }

        nodeList.forEach(node => {
            if (this.obstacles.findIndex(obstacle =>
                obstacle.x === node.position.x && obstacle.y === node.position.y) !== -1)
                return true;

            if (this.closedlist.findIndex(closeNode =>
                closeNode.position.x === node.position.x && closeNode.position.y === node.position.y) !== -1) {
                return true;
            }
            node.getCost(this.targetPos);
            if (this.checkOpenList(node))
                this.openlist.push(node);
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