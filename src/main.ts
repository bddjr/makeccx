import { Extension, api } from "clipcc-extension"
import { categories } from "./merge-categories"

export default class extends Extension {
    onInit(): void {
        // 启用扩展
        for (const c of categories) {
            api.addCategory({
                categoryId: c.id,
                messageId: c.id,
                color: c.color,
            })
            api.addBlocks(c.blocks)
        }
    }

    onUninit(): void {
        // 禁用扩展
        for (const c of categories) {
            api.removeCategory(c.id)
        }
    }

    // beforeProjectLoad(data: any, extensions: any): void {}

    // beforeProjectSave(data: any): void {}
}
