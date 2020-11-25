import React, { createRef } from 'react';
import './Board.css';

class Board extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     interval : 5
        // }
        this.isRightButtonDown = false;
        this.isBuildObstacle = true;

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
            timeout = setTimeout(() => {
                console.debug("Resized");
                this.canvasResize();
                this.drawBoard();
            }, 500);
        })

        this.canvasRef.current.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);

        this.canvasRef.current.addEventListener("mousedown", (e) => {
            if (e.button === 2) {
                this.isBuildObstacle = !this.props.mapInfo.isThisObstacle(this.convertCoordinates(e.x, e.y))
                this.isRightButtonDown = true;
                console.log(this.isBuildObstacle);
            }
        })

        this.canvasRef.current.addEventListener("mousemove", (e) => {
            if (this.isRightButtonDown) {
                const coordinates = this.convertCoordinates(e.x, e.y);
                
                if (this.isBuildObstacle) {
                    if (this.props.mapInfo.isThisObstacle(coordinates) || 
                        !this.setPos(coordinates, "obstacles") || 
                        this.props.mapInfo.isThisTargetPos(coordinates) ||
                        this.props.mapInfo.isThisStartPos(coordinates)) {
                        return;
                    }
                    this.drawBox(coordinates, "gray");
                }
                else {
                    if (!this.props.mapInfo.isThisObstacle(coordinates) || !this.setPos(coordinates, "none"))
                        return;
                    this.drawBox(coordinates, "none");

                }

            }
        })

        this.canvasRef.current.addEventListener('mouseup', (e) => {
            if (e.button === 2)
                this.isRightButtonDown = false;

            if (e.button !== 0)
                return;

            const coordinates = this.convertCoordinates(e.x, e.y);
            if (!this.setPos(coordinates, this.nextType ? "startPos" : "targetPos"))
                return;
            this.nextType = !this.nextType;
            this.clearBoard();
        })
    }

    convertCoordinates = (x, y) => {
        return [Math.floor(x / this.props.interval), Math.floor(y / this.props.interval)];
    }

    setPos(coordinates, setType) {
        switch (setType) {
            case "startPos":
                this.props.mapInfo.setStartPos(coordinates);
                return true;
            case "targetPos":
                this.props.mapInfo.setTargetPos(coordinates);
                return true;
            case "obstacles":
                this.props.mapInfo.setObstacle(coordinates);
                return true;
            case "none":
                this.props.mapInfo.removeObstacle(coordinates);
                return true;
            default :
                return
        }

    }

    drawBox(coordinates, color) {
        let ctx = this.canvasRef.current.getContext('2d');
        let interval = this.props.interval;
        ctx.beginPath();
        if (color !== 'none') {
            ctx.fillStyle = color;
            ctx.lineWidth = "1";

            ctx.fillRect(
                coordinates[0] * interval,
                coordinates[1] * interval,
                interval, interval);
            ctx.rect(
                coordinates[0] * interval,
                coordinates[1] * interval,
                interval, interval)
            ctx.stroke();
        }
        else {
            ctx.lineWidth = "1";
            ctx.clearRect(
                coordinates[0] * interval,
                coordinates[1] * interval,
                interval, interval);
            ctx.rect(
                coordinates[0] * interval,
                coordinates[1] * interval,
                interval, interval)
            ctx.stroke();

        }
    }

    clearBoard() {
        let width = this.canvasRef.current.width;
        let height = this.canvasRef.current.height;
        this.canvasRef.current.getContext('2d').clearRect(0, 0, width, height);
        this.drawBoard();
    }

    drawBoard() {
        if (!this.canvasRef.current)
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

        console.log("DRAW BOARD", this.props.mapInfo)
        this.props.mapInfo.startPos && this.drawBox(this.props.mapInfo.startPos, "red")
        this.props.mapInfo.targetPos && this.drawBox(this.props.mapInfo.targetPos, "blue")
        this.props.mapInfo.obstacles.length > 0 &&
            this.props.mapInfo.obstacles.map((e) => this.drawBox(e, "gray"))
    }

    canvasResize() {
        let width = document.body.clientWidth || window.innerWidth || document.documentElement.clientWidth;
        let height = document.body.clientHeight || window.innerHeight || document.documentElement.clientHeight;

        if (this.canvasRef.current) {
            console.log(this.canvasRef.current)
            this.canvasRef.current.width = width;
            this.canvasRef.current.height = height;
        }
    }

    render() {
        this.canvasResize();
        this.drawBoard();
        
        return <canvas ref={this.canvasRef} />
    }
}

export default Board