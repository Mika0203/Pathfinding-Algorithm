import Board from './Board';

class App {
    board : Board;
    constructor($target : HTMLElement){
        this.board  = new Board($target);
    }
}

new App(document.getElementById('app')!);

