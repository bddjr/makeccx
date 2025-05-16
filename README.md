<!-- https://github.com/bddjr/makeccx -->

# makeccx

🚀 更好的 ClipCC 扩展开发框架，基于 esbuild + TypeScript 。

## 使用方法

1. 确保电脑已安装以下软件

   > [Git](https://git-scm.com/)  
   > [Node.js](https://nodejs.org/)  
   > [pnpm](https://pnpm.io/zh/)  
   > [VSCode](https://code.visualstudio.com/)  

2. 请确保您正在访问 https://github.com/bddjr/makeccx 。  
   点击右上角绿色 `Use this template` 按钮，然后点击 `Create a new repository` 创建仓库，  
   然后按照规范命名仓库，例如 `clipcc-extension-example` 。

3. 使用 `git clone` 将仓库下载到本地。  
   此处请将右侧网址替换成自己仓库的网址。

```
git clone https://github.com/myname/clipcc-extension-example
```

4. 进入文件夹，然后使用 `pnpm i` 安装依赖。

```
cd clipcc-extension-example
pnpm i
```

5. 扩展源代码在 `src` 文件夹。  
   更改文件 `src/info.json` ，例如将 `id` 改为 `myname.example`。

```json
{
    "id": "myname.example",
    "author": "My Name",
```

6. 运行 `pnpm build` 构建扩展，结果在 `dist` 文件夹。  

7. 如果您要发布扩展，请重写 `README.md` 文件。

---

## 有何不同

- 代码和语言文件无需完整 id 。

- 自带多个 `category` 的友好支持，开箱即用。

- 使用 `defineBlock` 创建积木，TypeScript 会自动识别 `function` 的 `args` 里面有哪些参数。

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

- 类型结构略有更改，详见 [src/global.d.ts](src/global.d.ts)

- 构建器使用 esbuild 构建代码，JSZip 创建 `ccx` 文件，构建过程不经过 `build` 文件夹。

- 自动包含 `LICENSE.txt` 文件，遵守 MIT 许可证。

如果想了解更多不同的地方，请看代码。

---

## 结尾

您可以随意更改 `src` 文件夹的内容，它们不会影响 `makeccx` 构建器本身。

构建器源代码在 `makeccx/makeccx.ts` 文件，配置参数在 `makeccx.config.ts` 文件，您可自行调整。

本项目略有更改，[ClipCC 官方文档](https://doc.codingclip.com/zh-cn/category/for-developers)仅供参考，请以实际情况为准。  

本项目并非 ClipCC 官方项目，作者不属于 Clip Team 。
