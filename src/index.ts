import Board from './Board';
import Astar from './Astar';

class App {
    board : Board;
    Astar : Astar;

    constructor($target : HTMLElement){
        this.board  = new Board({
            target : $target,
            onMouseUp : () => {
                console.log('mouse up')
            }
        });
        this.Astar = new Astar();
    }
}

new App(document.getElementById('app')!);

