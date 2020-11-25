import React, { createRef } from 'react';
import './Board.css';

class MapInfo {
    startPos = undefined;
    targetPos = undefined;
    obstacles = [];

    isThisObstacle = function (coordinates) {
        return this.obstacles.findIndex(e => e[0] === coordinates[0] && e[1] === coordinates[1]) === -1 ? false : true;
    }

    isThisStartPos = function (coordinates) {
        return this.startPos[0] === coordinates[0] && this.startPos[1] === coordinates[1];
    }

    isThisTargetPos = function (coordinates) {
        return this.targetPos[0] === coordinates[0] && this.targetPos[1] === coordinates[1];
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapInfo: new MapInfo()
        }

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
                this.isBuildObstacle = !this.state.mapInfo.isThisObstacle(this.convertCoordinates(e.x, e.y))
                this.isRightButtonDown = true;
                console.log(this.isBuildObstacle);
            }
        })

        this.canvasRef.current.addEventListener("mousemove", (e) => {
            if (this.isRightButtonDown) {
                const coordinates = this.convertCoordinates(e.x, e.y);
                
                if (this.isBuildObstacle) {
                    if (this.state.mapInfo.isThisObstacle(coordinates) || 
                        !this.setPos(coordinates, "obstacles") || 
                        this.state.mapInfo.isThisTargetPos(coordinates) ||
                        this.state.mapInfo.isThisStartPos(coordinates)) {
                        return;
                    }
                    this.drawBox(coordinates, "gray");
                }
                else {
                    if (!this.state.mapInfo.isThisObstacle(coordinates) || !this.setPos(coordinates, "none"))
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
                this.setState({
                    mapInfo: {
                        ...this.state.mapInfo, startPos: coordinates
                    }
                })
                return true;
            case "targetPos":
                this.setState({
                    mapInfo: {
                        ...this.state.mapInfo, targetPos: coordinates
                    }
                })
                return true;
            case "obstacles":
                this.setState({
                    mapInfo: {
                        ...this.state.mapInfo, obstacles: this.state.mapInfo.obstacles.concat([coordinates])
                    }
                })
                return true;
            case "none":
                this.setState({
                    mapInfo: {
                        ...this.state.mapInfo, obstacles:
                            this.state.mapInfo.obstacles.filter(e => !(e[0] === coordinates[0] && e[1] === coordinates[1]))
                    }
                })
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

        console.log("DRAW BOARD", this.state.mapInfo)
        this.state.mapInfo.startPos && this.drawBox(this.state.mapInfo.startPos, "red")
        this.state.mapInfo.targetPos && this.drawBox(this.state.mapInfo.targetPos, "blue")
        this.state.mapInfo.obstacles.length > 0 &&
            this.state.mapInfo.obstacles.map((e) => this.drawBox(e, "gray"))
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
        return <canvas ref={this.canvasRef} />
    }
}

export default Board