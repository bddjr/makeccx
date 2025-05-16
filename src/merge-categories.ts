import { type } from 'clipcc-extension'
import { appendID } from './utils/append-id'
import { id as ccxID } from "./info.json"

import { category_hello } from './categories/hello/hello'
import { category_boolean } from './categories/boolean/boolean'


const globalColor: string = '#66CCFF'

const input: MyCategory[] = [
    category_hello,
    category_boolean,
]


// ====================================================

export const categories: {
    id: string
    color: string
    blocks: type.BlockPrototype[]
}[] = input.filter((c) => (typeof c === 'object')).map((c) => {

    const cid = appendID(ccxID, c.id)

    let blocks = c.blocks.filter((b) => (typeof b === 'object')).map(myBlock => {
        const blockID = appendID(cid, myBlock.id)
        const out: type.BlockPrototype = {
            opcode: blockID,
            messageId: blockID,
            categoryId: cid,
            type: myBlock.type,
            function: myBlock.function,
        }
        if (typeof myBlock.option === 'object') {
            out.option = myBlock.option
        }
        if (myBlock.branchCount != null) {
            out.branchCount = myBlock.branchCount
        }
        if (typeof myBlock.param === 'object') {
            out.param = {}
            for (const key in myBlock.param) {
                const item = myBlock.param[key]
                // 将undefined输入给扩展加载器会导致加载错误，
                // 因此需要在加载时忽略undefined。
                if (typeof item !== 'object') continue
                const outParam: type.ParameterPrototype = {
                    type: item.type,
                    default: item.defaultValue,
                    field: item.field,
                    shadow: item.shadow,
                }
                if (item.menu) {
                    if (item.menu.topID) {
                        // 如果topID存在，会构建为顶层id，
                        // 例如topID是"mymenu"，则构建后的id是"bddjr.makeccx.mymenu"。
                        outParam.menuId = appendID(ccxID, item.menu.topID)
                    } else {
                        // 如果topID不存在，会使用param的key构建相对id，
                        // 例如类别id是"category"，积木id是"block"，param的key是"menu"，
                        // 则构建后的id是"bddjr.makeccx.category.block.menu"。
                        outParam.menuId = appendID(blockID, key)
                    }
                    outParam.menu = item.menu.items.map((v) => ({
                        messageId: appendID(outParam.menuId, v.id),
                        value: v.value,
                    }))
                }
                out.param[key] = outParam
            }
        }
        return out
    })

    return {
        id: cid,
        color: c.color || globalColor,
        blocks,
    }
})
