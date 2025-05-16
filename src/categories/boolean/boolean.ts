import { type } from "clipcc-extension"
import { toScratchBoolean } from "../../utils/to-scratch-boolean"
import defineBlock from "../../utils/define-block"

const categoryID: string = 'boolean'
const color: string = '#59C059'



const blocks: MyBlock<BlockParams>[] = [
    defineBlock({
        id: 'boolean',
        type: type.BlockType.BOOLEAN,
        param: {
            a: {
                type: type.ParameterType.STRING,
                defaultValue: '0'
            },
        },
        function(args, util): boolean {
            return toScratchBoolean(args.a)
        }
    }),
    defineBlock({
        id: 'equal',
        type: type.BlockType.BOOLEAN,
        param: {
            a: {
                type: type.ParameterType.STRING,
                defaultValue: 'a'
            },
            b: {
                type: type.ParameterType.STRING,
                defaultValue: 'A'
            },
        },
        function(args, util): boolean {
            return args.a == args.b
        }
    })
]



export const category_boolean: MyCategory = {
    id: categoryID,
    color,
    blocks,
}
