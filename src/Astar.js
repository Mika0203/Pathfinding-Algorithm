class Astar {
    startPos = undefined;
    targetPos = undefined;
    calc = 0;
    openlist = [];
    closedlist = [];

    start(start, target, obstacles){
        this.openlist = [];
        this.closedlist = [];
        this.startPos = start;
        this.targetPos = target;
        this.calc = 1;
        
        let node = new Node(start, undefined);
        this.openlist.push(node);

        while(true){
            if(this.calc > 10000){
                console.log("can't find..")
                break;
            }
            

            this.calc++;
            this.closeNode(node);
            this.getAroundNodes(node);
            node = this.getNextNode();

            if(target[0] === node.x && target[1] === node.y){
                
                let findNode = node;
                while(findNode){
                    console.log(findNode.parent);
                    findNode = findNode.parent;
                }
                console.log("FIND!",this.calc,"----------------------------");
                break;
            }
        }

    }

    closeNode(node){
        let idx = this.openlist.indexOf(node)
        this.openlist.splice(idx, 1);
        this.closedlist.push(node);
    }

    getNextNode(){
        let minH = Infinity;
        let minNode = undefined;

        this.openlist.forEach(node => {
            if(node.f < minH){
                minH = node.f;
                minNode = node;
            }
        });

        return minNode;
    }

    getAroundNodes(node) {
        let nodeList = [];
        nodeList.push(
            new Node([node.x-1, node.y], node),
            new Node([node.x+1, node.y], node),
            new Node([node.x, node.y-1], node),
            new Node([node.x, node.y+1], node),
        )

        nodeList.forEach(node => {
            node.getCost(this.targetPos);
            if(this.checkOpenList(node))
                this.openlist.push(node);
        });
    }

    checkOpenList(currentNode){
        // openlist 와 위치를 비교해서 같으면 g 값을 비교해서 g값이 더 낮은걸로 교체한다.
        let findedNode = undefined;
        let idx = -1;
        for(let i in this.openlist){
            let node = this.openlist[i];
            if(node.x === currentNode.x && node.y === currentNode.y){
                findedNode = node;
                idx = i;
            }
        };

        if(findedNode){
            if(findedNode.g > currentNode.g){
                this.openlist[idx] = currentNode;
            }
            return false;
        }
        else{
            return true;
        }


    }
}

class Node {
    x = undefined;
    y = undefined;
    parent = undefined;
    
    f = undefined;
    g = undefined;
    h = undefined;

    constructor(coordinates, parent){
        this.x = coordinates[0];
        this.y = coordinates[1];
        this.parent = parent;
        this.g = !parent ? 0 : parent.g + 10;
    }

    getCost(targetPos){
        this.h = this.getDistance(targetPos);
        this.f = this.g + this.h;
    }

    getDistance(target){
        return Math.abs(target[0] - this.x) + Math.abs(target[1] - this.y) * 10;
    }

}


export default Astar