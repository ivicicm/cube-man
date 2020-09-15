import * as Model from  '../model/index'
import { deepCopy } from '../utils/general'

function mapCharToObject(ch: string): Model.GameObject | undefined {
    switch(ch) {
        case ' ':
        case '_':
            return undefined
        case 'w':
            return new Model.Wall()
        case 'p':
            return new Model.Player()
        case 'c':
            return new Model.Cube()
        case 'd':
            return new Model.Drill()
        case 'l':
            return new Model.Laser()
        default:
            throw  new Error('Unknown character in level text file.')
    }
}

export default class Controller {
    model: Model.GameModel
    player?: Model.Player
    waitingForInput = true
    setToScreen: (model: Model.GameModel) => void

    constructor(gameChart: string, setToScreen: (model: Model.GameModel) => void) {
        this.setToScreen = setToScreen
        let lines = gameChart.split(/\r?\n/)
        let size = lines[0].length / 2
        this.model = new Model.GameModel(size, size)

        lines.forEach((line, j) => {
            for(let i = 0; i < size; i++) {
                let o = mapCharToObject(line[i*2])
                if(o) {
                    this.model.placeObject(o, i, j, o.initFloor)
                    if(line[i*2 + 1] !== ' ')
                        o.orientation = parseInt(line[i*2 + 1]) as Model.Direction
                    if(o instanceof Model.Player)
                        this.player = o
                }
            }
        })
        this.execStaticActions()
        this.setToScreen(deepCopy(this.model))
    }

    async playerMove(d: Model.Direction | 'rotate left' | 'rotate right') {
        if(this.waitingForInput === false)
            return
        try {
            this.waitingForInput = false
            if(typeof d !== 'string' && this.player) {
                let group = this.player.canMove(d, this.model)
                if(group) {
                    this.model.moveGroup(group, d)
                    this.execStaticActions()
                    this.setToScreen(deepCopy(this.model))
                }
            }
            else {
                if(this.player && this.player.rotateIfPossible(d as 'rotate left' | 'rotate right', this.model)) {
                    this.execStaticActions()
                    this.setToScreen(deepCopy(this.model))
                }
            }
        }
        finally {
            this.waitingForInput = true
        }
    }

    execStaticActions() {
        let actions: (Model.StaticAction & { o: Model.GameObject })[] = []
        for(let column of this.model.map) {
            for(let tile of column)
                for(let element of [tile.element, tile.floorElement]) {
                    if(element && element.temporary) {
                        this.model.map[element.x as number][element.y as number].element = undefined
                    }
                    else if(element && element.staticActions.length > 0) {
                        element.staticActions
                            .map(x => ({o: element as Model.GameObject, ...x}))
                            .forEach(x => actions.push(x))
                    }
                }
        }
        actions.sort((a,b) => a.priority - b.priority)
        actions.forEach(a => a.action.call(a.o, this.model))
    }
}