import React, { createRef } from 'react';
import './Board.css';

class MapInfo {
    startPos = undefined;
    targetPos = undefined;
    obstacles = [];
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            mapInfo : new MapInfo()
        }

        this.isRightButtonDown = false;
        this.nextType = true;
        this.canvasRef = createRef();
        this.canvasResize = this.canvasResize.bind(this);
        this.drawBoard = this.drawBoard.bind(this);
        this.drawBox = this.drawBox.bind(this);
    }

    componentDidMount() {
        this.canvasResize();
        this.drawBoard();


        let timeout = undefined;
        window.addEventListener("resize", (e) => {
            timeout && clearTimeout(timeout)
            timeout = setTimeout(() =>{
                console.debug("Resized");
                this.canvasResize();
                this.drawBoard();
            }, 500);
        })

        this.canvasRef.current.addEventListener('contextmenu', function(e) {
            e.preventDefault();
          }, false);

        this.canvasRef.current.addEventListener("mousedown", (e) =>{
            if(e.button === 2)
                this.isRightButtonDown = true;
        })

        this.canvasRef.current.addEventListener("mousemove", (e) => {
            if(this.isRightButtonDown){
                let x = Math.floor(e.x / this.props.interval);
                let y = Math.floor(e.y / this.props.interval);
                console.log(x, y)
                
                if (!this.setPos([x, y], "obstacles"))
                    return;
                this.drawBox([x,y],"gray");
            }
        })

        this.canvasRef.current.addEventListener('mouseup', (e) => {
            if(e.button === 2)
                this.isRightButtonDown = false;

            if(e.button !== 0)
                return;

            let x = Math.floor(e.x / this.props.interval);
            let y = Math.floor(e.y / this.props.interval);
            if (!this.setPos([x, y], this.nextType ? "startPos" : "targetPos"))
                return;
            this.nextType = !this.nextType;
            this.clearBoard();
        })
    }

    setPos(coordinates, setType) {
        if (setType === "startPos") {
            this.setState({
              mapInfo : {
                   ...this.state.mapInfo, startPos : coordinates
               }  
            })
            return true;
        }
        else if(setType === "targetPos"){
            this.setState({
               mapInfo : {
                    ...this.state.mapInfo, targetPos : coordinates
                }  
             })
            return true;
        }
        else if(setType === "obstacles"){
            this.setState({
                mapInfo : {
                    ...this.state.mapInfo, obstacles : this.state.mapInfo.obstacles.concat([coordinates])
                }  
             })
            return true;
        }
    }

    drawBox(coordinates, color) {
        let ctx = this.canvasRef.current.getContext('2d');
        let interval = this.props.interval;
        ctx.beginPath();
        ctx.fillStyle = color;
        let x = coordinates[0];
        let y = coordinates[1];
        ctx.fillRect(x * interval, y * interval, interval, interval);
        ctx.stroke();
    }

    clearBoard() {
        let width = this.canvasRef.current.width;
        let height = this.canvasRef.current.height;
        this.canvasRef.current.getContext('2d').clearRect(0, 0, width, height);
        this.drawBoard();
    }

    drawBoard() {
        if(!this.canvasRef.current)
            return;

        let ctx = this.canvasRef.current.getContext('2d');
        let width = this.canvasRef.current.width;
        let height = this.canvasRef.current.height;
        let interval = this.props.interval;

        // Y
        for (let i = 0; i < width; i += interval) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        // X
        for (let i = 0; i < height; i += interval) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        console.log("DRAW BOARD", this.state.mapInfo)
        this.state.mapInfo.startPos && this.drawBox(this.state.mapInfo.startPos, "red")
        this.state.mapInfo.targetPos && this.drawBox(this.state.mapInfo.targetPos, "blue")
        this.state.mapInfo.obstacles.length > 0 && 
            this.state.mapInfo.obstacles.map((e) => this.drawBox(e, "gray"))
    }

    canvasResize() {
        let width = document.body.clientWidth || window.innerWidth || document.documentElement.clientWidth;
        let height = document.body.clientHeight || window.innerHeight || document.documentElement.clientHeight;
        
        if(this.canvasRef.current){
            console.log(this.canvasRef.current)
            this.canvasRef.current.width = width;
            this.canvasRef.current.height = height;
        }
    }

    render() {
        return <canvas ref={this.canvasRef} />
    }
}

export default Board