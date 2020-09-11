import wallImage from "../assets/brickWall.svg"

export class MapTile {
    element?: GameObject
    floorElement?: GameObject
}

export type Direction = 1 | 2 | 3 | 4

type Coords = {
    x: number,
    y: number
}

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
            case 1: {
                y--
                if(y < 0)
                    return undefined
                break
            }
            case 2: {
                x++
                if(x >= this.map.length)
                    return undefined
                break
            }
            case 3: {
                y++
                if(y >= this.map[0].length)
                    return undefined
                break
            }
            case 4: {
                x--
                if(x < 0)
                    return undefined
                break
            }
        }
        return { x, y }
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
            ([1, 2, 3, 4] as Direction[])
                .map(d => gameObject.getConnected(d, this))
                .filter(o => o && !found.includes(o))
                .forEach(o => found.push(o as GameObject))
        }
        return found
    }

    moveGroup(group: GameObject[], d: Direction) {
        group.forEach(o => {
            let coords = this.translateCoords(o.x as number, o.y as number, d) as Coords
            // do object type specific things
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
        if(this.x && this.y && this.connectionDirs.includes(((d - this.orientation + 4) % 4) as Direction)) {
            let neighbour = model.getNeighbour(this.x, this.y, d)
            if(neighbour instanceof GameObject && neighbour.connectionDirs.includes(((d + 2 - neighbour.orientation + 4) % 4) as Direction )) {
                return neighbour
            }
        }
        return undefined
    }

    // as of this time, only non floor elements can move
    canMove(d: Direction, model: GameModel) : GameObject[] | false {
        let group = model.getConnectedGroup(this)
        let canMove = group
            .map(o => {
                let target = model.getNeighbour(this.x as number, this.y as number, d)
                // adjust this by object specific properties
                return target === "blank" || (target instanceof GameObject && group.includes(target))
            })
            .reduce((x,y) => x && y)
        return canMove && group
    }

    readonly abstract image: string | ((model: GameModel) => string)
    readonly initFloor = false
}

export class Wall extends GameObject {
    image = wallImage
}

// player, cube connectionDirs on all sides, player needs to be saved somewhere
