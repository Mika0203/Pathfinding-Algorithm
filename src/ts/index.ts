import Board from './Board';
import Astar from './Astar';
import UI from './UI';
import MapInfo from './MapInfo';
import '../style.css';
import { coordinates } from './lib';

class App {
    board : Board;
    Astar : Astar;
    ui : UI;
    mapInfo : MapInfo;

    constructor($target : HTMLElement){
        this.mapInfo = new MapInfo();
        this.Astar = new Astar();

        this.board  = new Board({
            target : $target,
            mapInfo : this.mapInfo,
        });

        this.ui = new UI({
            target : $target,
            startSearch : () => this.startSearch(),
            onChangeIsCanPassCorner : (b : boolean) => this.Astar.isCanCorner = b,
            onChangeIsCanPassCross : (b : boolean) => this.Astar.isCanCross = b
        });
    };

    startSearch(){
        const result = this.Astar.start(this.mapInfo);
        const path : coordinates[] = [];

        if(result.findedNode) {
            let node = result.findedNode;
            while(node){
                path.push(node.position);
                if(node.parent){
                    node = node.parent
                } else {
                    break;
                }
            }
            this.board.drawPath(path);
        }
    }

}

new App(document.getElementById('app')!);

