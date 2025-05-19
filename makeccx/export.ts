import esbuild from 'esbuild'
import { type } from 'clipcc-extension'

export interface Config {
    /**
     * 构建前清空dist文件夹。  
     * 如果此选项设为false，会保留旧版本的ccx文件。  
     * @default false
     */
    clearDist?: boolean

    /**
     * （调试）输出ccx文件之前，输出到文件夹下  
     * @default false
     */
    outputFilesBeforeZip?: boolean

    /**
     * （调试）将构建后的语言文件JSON输出到终端  
     * @default false
     */
    logLocales?: boolean

    /** 文件路径 */
    path?: {
        /**
         * 扩展主程序文件位置。  
         * @default "src/main.ts"
         */
        main?: string

        /**
         * 扩展语言文件夹位置。  
         * @default "src/locales"
         */
        locales?: string

        /**
         * 扩展信息文件位置。  
         * @default "src/info.json"
         */
        info?: string

        /**
         * 扩展选项文件位置。
         * @default "src/settings.json"
         */
        settings?: string

        /**
         * 构建结果文件夹位置。  
         * @default "dist"
         */
        dist?: string

        /**
         * 构建结果文件名格式。
         * @default (info: type.ExtensionInfo) => `${info.id}@${info.version}`
         */
        outputName?: (info: type.ExtensionInfo) => string

        /**
         * 构建结果文件后缀。
         * @default "ccx"
         */
        outputExt?: string

        /**
         * 许可证文件所在位置，或是否开启该选项。
         * @default true
         */
        license?: string | boolean
    }

    /**
     * esbuild 构建选项  
     * https://esbuild.github.io/api/#build  
     */
    esbuild?: esbuild.BuildOptions
}

export function defineConfig(c: Config) {
    return c
}
