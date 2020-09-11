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

        lines.forEach((line, i) => {
            for(let j = 0; j < size; j += 2) {
                let o = mapCharToObject(line[j])
                if(o) {
                    this.model.placeObject(o, i, j, o.initFloor)
                    if(line[j] !== ' ')
                        o.orientation = parseInt(line[j]) as Model.Direction
                }
            }
        })
    }
}