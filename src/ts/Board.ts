import { coordinates } from "./lib";
import MapInfo from "./MapInfo";

enum NodeType {
    startPos,
    targetPos,
    obstalce,
    none
};

interface BoardProps{
    target : HTMLElement;
    mapInfo : MapInfo;
};

class Board {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private interval: number;
    private timeout: NodeJS.Timeout | undefined;
    private isBuildObstacle: boolean;
    private isRightButtonDown: boolean;
    private nextType : boolean = true;
    private props : BoardProps|undefined;
    private mapInfo : MapInfo;

    constructor(props : BoardProps) {
        this.props = props;
        this.isBuildObstacle = false;
        this.isRightButtonDown = false;

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.interval = 30;
        this.mapInfo = props.mapInfo;

        props.target.appendChild(this.canvas);

        this.canvasResize();
        this.timeout = undefined;

        window.addEventListener("resize", () => {
            this.timeout && clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.canvasResize();
            }, 500);
        });

        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        }, false);

        this.canvas.addEventListener('mousedown', (e) => {
            console.log(e.button);
            if (e.button === 2) {
                this.isBuildObstacle = !this.mapInfo.isThisObstacle(this.convertCoordinates({ x: e.x, y: e.y }));
                this.isRightButtonDown = true;
                const coordinates = this.convertCoordinates({
                    x: e.x,
                    y: e.y
                });

                if (this.isBuildObstacle) {
                    if (this.mapInfo.isThisObstacle(coordinates) ||
                        !this.setPos(coordinates, NodeType.obstalce) ||
                        this.mapInfo.isThisTargetPos(coordinates) ||
                        this.mapInfo.isThisStartPos(coordinates)) {
                        return;
                    }
                    this.drawBox(coordinates, "gray");
                }
                else {
                    if (!this.mapInfo.isThisObstacle(coordinates) || !this.setPos(coordinates, NodeType.none))
                        return;
                    this.drawBox(coordinates, "none");
                }
            }
        })

        this.canvas.addEventListener("mousemove", (e) => {
            if (this.isRightButtonDown) {
                const coordinates = this.convertCoordinates({
                    x: e.x,
                    y: e.y
                });

                if (this.isBuildObstacle) {
                    if (this.mapInfo.isThisObstacle(coordinates) ||
                        !this.setPos(coordinates, NodeType.obstalce) ||
                        this.mapInfo.isThisTargetPos(coordinates) ||
                        this.mapInfo.isThisStartPos(coordinates)) {
                        return;
                    }
                    this.drawBox(coordinates, "gray");
                }
                else {
                    if (!this.mapInfo.isThisObstacle(coordinates) || !this.setPos(coordinates, NodeType.none))
                        return;
                    this.drawBox(coordinates, "none");

                }

            }
        })

        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 2)
                this.isRightButtonDown = false;

            if (e.button !== 0)
                return;

            const coordinates = this.convertCoordinates({
                x: e.x,
                y: e.y
            });

            if (!this.setPos(coordinates, this.nextType ? NodeType.startPos : NodeType.targetPos))
                return;

            this.nextType = !this.nextType;
            this.clearBoard();
        })
    }

    private clearBoard() {
        let width = this.canvas.width;
        let height = this.canvas.height;
        this.context && this.context.clearRect(0, 0, width, height);
        this.drawBoard();
    }

    private drawBox(coordinates: coordinates, color : string) {
        const ctx = this.context;
        if(!ctx)
            return;

        let interval = this.interval;
        ctx.beginPath();
        if (color !== 'none') {
            ctx.fillStyle = color;
            ctx.lineWidth = 1;

            ctx.fillRect(
                coordinates.x * interval,
                coordinates.y * interval,
                interval, interval);
            ctx.rect(
                coordinates.x * interval,
                coordinates.y * interval,
                interval, interval)
            ctx.stroke();
        }
        else {
            ctx.lineWidth = 1;
            ctx.clearRect(
                coordinates.x * interval,
                coordinates.y * interval,
                interval, interval);
            ctx.rect(
                coordinates.x * interval,
                coordinates.y * interval,
                interval, interval)
            ctx.stroke();
        }
    }

    private setPos(coordinates: coordinates, setType : NodeType) {
        switch (setType) {
            case NodeType.startPos :
                this.mapInfo.startPos = coordinates;
                return true;
            case NodeType.targetPos:
                this.mapInfo.targetPos = coordinates;
                return true;
            case NodeType.obstalce:
                this.mapInfo.addObstacle(coordinates);
                return true;
            case NodeType.none:
                this.mapInfo.removeObstacle(coordinates);
                return true;
            default:
                return
        }
    }

    private convertCoordinates = (coordinates: coordinates): coordinates => {
        return {
            x: Math.floor(coordinates.x / this.interval),
            y: Math.floor(coordinates.y / this.interval)
        };
    }

    private canvasResize() {
        let width = document.body.clientWidth || window.innerWidth || document.documentElement.clientWidth;
        let height = document.body.clientHeight || window.innerHeight || document.documentElement.clientHeight;

        if (this.canvas) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        this.drawBoard();
    };

    private drawBoard() {
        let ctx = this.canvas.getContext('2d');
        if(!ctx)
            return;

        const width = this.canvas.width;
        const height = this.canvas.height;

        // Y
        for (let i = 0; i < width; i += this.interval) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        // X
        for (let i = 0; i < height; i += this.interval) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        this.mapInfo.startPos && this.drawBox(this.mapInfo.startPos, "red");
        this.mapInfo.targetPos && this.drawBox(this.mapInfo.targetPos, "blue");
        this.mapInfo.obstacles.length > 0 &&
            this.mapInfo.obstacles.map((e) => this.drawBox(e, "gray"))
    };

    public drawPath(path : coordinates[]) {
        this.clearBoard();

        const ctx = this.context;
        if(!ctx)
            return;

        const getCenter = (coordinate : coordinates) : coordinates => {
            return {
                x : coordinate.x * this.interval + this.interval * 0.5,
                y : coordinate.y * this.interval + this.interval * 0.5
            }
        }
        
        const center = getCenter(path[0]);
        ctx.moveTo(center.x, center.y);
        
        path.forEach(coordinate => {
            const center = getCenter(coordinate);
            ctx.lineTo(center.x, center.y);
        });

        ctx.stroke();
    }
}

export default Board