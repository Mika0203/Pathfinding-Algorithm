class Astar {
    startPos = undefined;
    targetPos = undefined;
    calc = 0;

    openlist = [];
    closedlist = [];
    obstacles = [];

    start(start, target, obstacles){
        this.openlist = [];
        this.closedlist = [];
        this.obstacles = obstacles;

        this.startPos = start;
        this.targetPos = target;
        this.calc = 1;
        
        let node = new Node(start, undefined);
        this.openlist.push(node);

        while(true){
            if(this.calc > 100000 || this.openlist.length === 0){
                console.log("can't find..")
                break;
            }
            
            this.calc++;
            this.closeNode(node);
            this.getAroundNodes(node);
            node = this.getNextNode();

            if(target[0] === node.x && target[1] === node.y){
                break;
            }
        }

        return {
           findedNode : node,
           closedList : this.closedlist
        }
            ;

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
            for(let i in this.obstacles){
                let obs = this.obstacles[i];
                if(obs[0] === node.x && obs[1] === node.y){
                    return true;
                }
            }

            node.getCost(this.targetPos);
            if(this.checkOpenList(node))
                this.openlist.push(node);
        });
    }

    checkOpenList(currentNode){
        let findedNode = undefined;
        let idx = -1;

        for(let i in this.openlist){
            let node = this.openlist[i];
            if(node.x === currentNode.x && node.y === currentNode.y){
                findedNode = node;
                idx = i;
                break;
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