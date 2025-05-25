import { type } from "clipcc-extension"
import defineBlock from "../../utils/define-block"
import { myConfirm } from "../../utils/my-confirm"
import { paramSprites } from "../../utils/param-sprites"

const categoryID: string = 'hello'
const color: string = '' // Use global color



const blocks: MyBlock<BlockParams>[] = [
    defineBlock({
        id: 'github',
        type: undefined,
        async function(args, util) {
            const url = "https://github.com/bddjr/makeccx"
            if (await myConfirm('', url))
                open(url)
        }
    }),
    defineBlock({
        id: 'hello',
        type: type.BlockType.REPORTER,
        function(args, util): string {
            return "Hello, ClipCC!"
        }
    }),
    defineBlock({
        id: 'log',
        type: type.BlockType.COMMAND,
        function(args, util): void {
            console.log("Hello, ClipCC!")
        }
    }),
    defineBlock({
        id: 'abc',
        type: type.BlockType.REPORTER,
        param: {
            a: {
                type: type.ParameterType.STRING,
                defaultValue: '1',
                menu: {
                    items: [{
                        id: 'item1',
                        value: '1'
                    }, {
                        id: 'item2',
                        value: '2'
                    }, {
                        id: 'item3',
                        value: '3'
                    }],
                }
            },
        },
        function(args, util): any {
            return args.a
        }
    }),
    defineBlock({
        id: 'typeof',
        type: type.BlockType.REPORTER,
        param: {
            a: {
                type: type.ParameterType.STRING,
                defaultValue: '0'
            },
        },
        function(args, util): string {
            return typeof args.a
        }
    }),
    defineBlock({
        id: 'sprite_name',
        type: type.BlockType.REPORTER,
        param: {
            a: paramSprites,
        },
        function(args, util): string {
            return args.a
        }
    }),
]



export const category_hello: MyCategory = {
    id: categoryID,
    color,
    blocks,
}
