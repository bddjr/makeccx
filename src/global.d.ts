import { type } from "clipcc-extension"

declare global {
    var ClipCCExtension: typeof import("clipcc-extension")

    interface MyCategory {
        id: string
        color?: string
        blocks: MyBlock<BlockParams>[]
    }

    interface MyBlock<T extends BlockParams> {
        id: string;
        type: type.BlockType;
        option?: type.BlockOption;
        branchCount?: number;
        param?: T;
        function(args?: {
            [K in keyof T]: K extends "mutation" ? undefined : (
                T[K] extends MyParam ? any : never
            )
        } & {
            // mutation是保留给自制积木的字段，始终返回undefined。
            mutation: undefined;
        }, util?: BlockFuncUtil): any
    }

    type BlockParams = {
        [key: string]: MyParam
        // mutation是保留给自制积木的字段，不得擅自填写。
        // 将undefined输入给扩展加载器会导致加载错误，
        // 因此需要在加载时忽略undefined。
        mutation?: undefined
    }

    interface BlockFuncUtil {
        currentBlock: { [key: string]: any }
        sequencer: {
            activeThread: any // null
            runtime: { [key: string]: any }
            timer: {
                startTime: number
                nowObj: typeof Date
            }
        }
        thread: {
            blockGlowInFrame: string
            topBlock: string
            runtime: { [key: string]: any }
            [key: string]: any
        }
        _nowObj: {
            now(): number
        }
        currentBlockId: string
        nowObj: {
            now(): number
        }
        runtime: { [key: string]: any }
        target: { [key: string]: any }
    }

    type DefaultParamValue = string | number | boolean

    interface MyParam {
        type: type.ParameterType;
        defaultValue: DefaultParamValue;
        menu?: MyMenu;
        field?: boolean;
        shadow?: type.ShadowPrototype;
    }

    interface MyMenu {
        // 如果topID存在，会构建为顶层id，
        // 例如topID是"mymenu"，则构建后的id是"bddjr.makeccx.mymenu"。
        // 
        // 如果topID不存在，会使用param的key构建相对id，
        // 例如类别id是"category"，积木id是"block"，param的key是"menu"，
        // 则构建后的id是"bddjr.makeccx.category.block.menu"。
        topID?: string
        items: MyMenuItem[]
    }

    interface MyMenuItem {
        // 相对id
        id: string
        value: DefaultParamValue
    }
}
