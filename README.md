<!-- https://github.com/bddjr/makeccx -->

# makeccx

🚀 更好的 ClipCC 扩展开发框架，基于 [esbuild](https://esbuild.github.io/) + [TypeScript](https://www.typescriptlang.org/zh/) 。

## 开始

1. 确保电脑已安装以下软件

   > [Node.js](https://nodejs.org/)  
   > [VSCode](https://code.visualstudio.com/)  

2. 新建项目。  
   在文件夹里打开终端，运行下方命令

```
npm create makeccx@latest
```

3. 安装依赖。  
   使用 VSCode 打开文件夹，然后新建终端，运行下方命令

```
npm i 
```

4. 构建 `ccx` 文件。  
   运行下方命令，然后在 `dist` 文件夹查看构建结果。

```
npm run build
```

---

## 配置

构建器配置参数在 [`makeccx.config.ts`](makeccx.config.ts) 或 [`makeccx.config.js`](makeccx.config.js) 文件。  

有关配置参数，请参考 [`makeccx/export.ts`](makeccx/export.ts) 。

---

## 有何不同

- 代码和语言文件无需完整 id 。

- 自带多个 `category` 的友好支持，开箱即用。

- 使用 `defineBlock` 创建积木，TypeScript 会自动识别 `function` 的 `args` 里面有哪些参数，并在 VSCode 里给予相关提示。

```ts
defineBlock({
    id: 'abc',
    type: type.BlockType.REPORTER,
    param: {
        a: {
            type: type.ParameterType.STRING,
            defaultValue: '1',
        },
    },
    function(args, util): any {
        return args.a
    }
}),
```

- 语言文件支持多层写法，结构更清晰。

```json
{
    "name": "ClipCC Extension",
    "description": "description",
    "hello": {
        "": "Hello",
        "hello": "Say hello",
        "abc": {
            "": "abc[a]",
            "a": {
                "item1": "a",
                "item2": "b"
            }
        }
    }
}
```

- 语法略有更改，参考类型文件 [`src/global.d.ts`](src/global.d.ts)

- 使用 [esbuild](https://esbuild.github.io/) 构建代码，使用 [JSZip](https://stuk.github.io/jszip/) 创建 `ccx` 文件，构建过程不经过 `build` 文件夹。

- 结果不包含整个 `assets` 文件夹，只根据 `src/info.json` 的 `icon` 属性和 `inset_icon` 属性，添加对应的文件。

- 结果自动包含 LICENSE 文件（如果有）。

如果想了解更多不同的地方，请看代码。

---

## 从旧版迁移

### 1.0.*

1. 安装依赖

```
npm i makeccx --save-dev
```

2. 修改 `package.json` 的 `scripts` 字段

```json
  "scripts": {
    "build": "run-p typecheck build-only",
    "typecheck": "tsc",
    "build-only": "makeccx build"
  },
```

3. 删除 `makeccx.config.ts` 文件，或重写为以下格式

```js
import { defineConfig } from 'makeccx'

export default defineConfig({

})

```

4. （可选）删除 `makeccx` 文件夹。

---

## 下载源码，然后构建

```
git clone https://github.com/makeccx/makeccx
cd makeccx
npm i
npm run build

git clone https://github.com/makeccx/create-makeccx
cd create-makeccx
npm i
npm run build
```

---

## 结尾

本项目的 `src` 文件夹内容略有更改，[ClipCC 官方文档](https://doc.codingclip.com/zh-cn/category/for-developers)仅供参考，请以实际情况为准。

本项目并非 ClipCC 官方项目，作者不属于 Clip Team 。
