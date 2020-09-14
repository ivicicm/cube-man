import * as Model from  '../model/index'

function mapCharToObject(ch: string): Model.GameObject | undefined {
    switch(ch) {
        case ' ':
        case '_':
            return undefined
        case 'w':
            return new Model.Wall()
        default:
            throw  new Error('Unknown character in level text file.')
    }
}

export default class Controller {
    model: Model.GameModel

    constructor(gameChart: string) {
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
                }
            }
        })
    }
}