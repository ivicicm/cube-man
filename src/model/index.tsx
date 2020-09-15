import wallImage from "../assets/brickWall.svg"
import playerImage from "../assets/player.png"
import cubeImage from "../assets/cube.svg"
import drillImage from "../assets/drill.png"

export class MapTile {
    element?: GameObject
    floorElement?: GameObject
}

export type Direction = 0 | 1 | 2 | 3 
export type Rotation = "rotate left" | "rotate right"

type Coords = {
    x: number,
    y: number
}

const MaterialStrengthEnum  = {
    none: 0,
    light: 1,
    hard: 2
}
type MaterialStrength = 0 | 1 | 2

export class GameModel {
    map: MapTile[][]

    constructor(x: number, y: number) {
        this.map = []
        for(let i = 0; i < x; i++) {
            this.map[i] = []
            for(let j = 0; j < y; j++) {
                this.map[i][j] = new MapTile()
            }
        }
    }

    placeObject(o: GameObject, x: number, y: number, isFloor = false) {

        // remove gameObject from its previous location if it was there
        if(o.x !== undefined && o.y !== undefined) {
            if(this.map[o.x][o.y].element === o){
                this.map[o.x][o.y].element = undefined
            } else if (this.map[o.x][o.y].floorElement === o) {
                this.map[o.x][o.y].floorElement = undefined
            }
        }

        // place object to the new location
        if(isFloor)
            this.map[x][y].floorElement = o
        else
            this.map[x][y].element = o
        o.x = x
        o.y = y
    }

    private translateCoords(x: number, y: number, d: Direction): Coords | undefined {
        switch(d) {
            case 0: {
                y--
                if(y < 0)
                    return undefined
                break
            }
            case 1: {
                x++
                if(x >= this.map.length)
                    return undefined
                break
            }
            case 2: {
                y++
                if(y >= this.map[0].length)
                    return undefined
                break
            }
            case 3: {
                x--
                if(x < 0)
                    return undefined
                break
            }
        }
        return { x, y }
    }

    rotateCoords(rotated: Coords, anchor: Coords, d: 'rotate right' | 'rotate left') {
        let relCoords = {
            x: rotated.x - anchor.x,
            y: rotated.y - anchor.y
        }
        let relRotated: Coords
        if(d === 'rotate left') {
            relRotated = {
                x: relCoords.y,
                y: -relCoords.x
            }
        } else {
            relRotated = {
                x: -relCoords.y,
                y: relCoords.x
            }
        }
        let result = {
            x: relRotated.x + anchor.x,
            y: relRotated.y + anchor.y
        }
        return result.x >= 0 && result.x < this.map.length &&  result.y >= 0 && result.y < this.map[0].length ?
            result : undefined
    }

    getNeighbour(x: number, y: number, d: Direction, isFloor = false): GameObject | "blank" | "outOfMap" {
        let coords = this.translateCoords(x, y, d)
        if(!coords)
            return "outOfMap"
        if(isFloor)
            return this.map[coords.x][coords.y].floorElement || "blank"
        else
            return this.map[coords.x][coords.y].element || "blank"
    }

    getConnectedGroup(o: GameObject) {
        let found: GameObject[] = []
        let stack = [o]
        while(stack.length > 0) {
            let gameObject = stack.pop() as GameObject
            found.push(gameObject);
            ([0, 1, 2, 3] as Direction[])
                .map(d => gameObject.getConnected(d, this))
                .filter(o => o && !found.includes(o) && !stack.includes(o))
                .forEach(o => stack.push(o as GameObject))
            console.log(stack)
        }
        return found
    }

    moveGroup(group: GameObject[], d: Direction) {
        group.forEach(o => {
            let coords = this.translateCoords(o.x as number, o.y as number, d) as Coords
            if(o.moveSideEffects) {
                let target = this.map[coords.x][coords.y].element
                if(!target || group.includes(target))
                    target = undefined
                this.placeObject(o, coords.x, coords.y)
                o.moveSideEffects(target, d, this)
            } else
                this.placeObject(o, coords.x, coords.y)
        })
    }
}

export abstract class GameObject {
    x?: number
    y?: number
    orientation: Direction = 1
    readonly connectionDirs: Direction[] = []

    // as of this time, only non floor elements can be connected
    getConnected(d: Direction, model: GameModel): GameObject | undefined {
        if(this.x !== undefined && this.y !== undefined && this.connectionDirs.includes(((d - this.orientation + 4) % 4) as Direction)) {
            let neighbour = model.getNeighbour(this.x, this.y, d)
            if(neighbour instanceof GameObject && neighbour.connectionDirs.includes(((d + 2 - neighbour.orientation + 4) % 4) as Direction )) {
                return neighbour
            }
        }
        return undefined
    }

    // as of this time, only non floor elements can move
    canMove(d: Direction, model: GameModel) : GameObject[] | undefined {
        let group = model.getConnectedGroup(this)
        let canMove = group
            .map(o => {
                let target = model.getNeighbour(o.x as number, o.y as number, d)
                // adjust this by object specific properties
                return target === "blank" || (target instanceof GameObject && (group.includes(target) || o.canMoveOverObject(target, d, model)))
            })
            .reduce((x,y) => x && y)
        return canMove ? group : undefined
    }

    rotateIfPossible(d: 'rotate right' | 'rotate left', model: GameModel) {
        let group = model.getConnectedGroup(this)
        let endCoords = group.map(o => model.rotateCoords(
                { x: o.x as number, y: o.y as number},
                { x: this.x as number, y: this.y as number},
                d
            ))
        let canRotate = endCoords.map(c => { 
                if(!c)
                    return false
                let target = model.map[c.x][c.y].element
                return !target || group.includes(target) || target.strength < MaterialStrengthEnum.light
            })
            .reduce((x,y) => x && y)
        if(canRotate)
            group.forEach((o, index) => { 
                model.placeObject(o, endCoords[index]?.x as number, endCoords[index]?.y as number, false)
                o.orientation = ( o.orientation + 4 + (d === 'rotate left' ? -1 : 1 )) % 4 as Direction
            })
        return canRotate
    }

    readonly abstract image: string | ((model: GameModel) => string)
    readonly initFloor = false
    readonly strength = MaterialStrengthEnum.light
    canMoveOverObject(target: GameObject, d: Direction, model: GameModel) {
        return target.strength < MaterialStrengthEnum.light
    }
    moveSideEffects?: (target: GameObject | undefined, d: Direction, model: GameModel) => void
}

export class Wall extends GameObject {
    image = wallImage
    strength = MaterialStrengthEnum.hard
}

export class Player extends GameObject {
    image = playerImage
    connectionDirs = [ 0, 1, 2, 3 ] as Direction[]
}

export class Cube extends GameObject {
    image = cubeImage
    connectionDirs = [ 0, 1, 2, 3 ] as Direction[]
}

export class Drill extends GameObject {
    image = drillImage
    connectionDirs = [ 2 ] as Direction[]
    strength = MaterialStrengthEnum.hard
    canMoveOverObject(target: GameObject, d: Direction) {
        return target.strength < MaterialStrengthEnum.light || d === this.orientation
    }
    moveSideEffects = (target: GameObject | undefined, d: Direction, model: GameModel) => {
        console.log('moving')
        console.log(target)
        if(target && target.strength > MaterialStrengthEnum.light) {
            model.map[this.x as number][this.y as number].element = undefined
        }
    }
}
