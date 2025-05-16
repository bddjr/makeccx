<!-- https://github.com/bddjr/makeccx -->

# makeccx

🚀 更好的 ClipCC 扩展开发框架，基于 esbuild + TypeScript 。

## 使用方法

1. 确认您正在访问 https://github.com/bddjr/makeccx ，而不是别人的扩展仓库。

2. 确保电脑已安装以下软件

   > [Git](https://git-scm.com/)  
   > [Node.js](https://nodejs.org/)  
   > [pnpm](https://pnpm.io/zh/)  
   > [VSCode](https://code.visualstudio.com/)

3. 点击右上角的绿色 `Use this template` 按钮，  
   然后点击 `Create a new repository` 创建仓库。  

4. 按照规范命名仓库，例如 `clipcc-extension-example` 。  

5. 使用 `git clone` 将仓库下载到本地。  

```
git clone <此处填写仓库的网址>
```

6. 使用 VSCode 打开文件夹。

7. 更改文件 `src/info.json` ，例如将 `id` 改为 `myname.example`。

```json
{
    "id": "myname.example",
    "author": "My Name",
```

8. 在 VSCode 里新建终端，然后运行以下命令安装依赖。

```
pnpm i
```

9. 运行以下命令构建 `ccx` 文件，结果在 `dist` 文件夹。

```
pnpm build
```

10. 将 `README.md` 清空，然后重写为如下格式

````md
# Example
简单介绍一下扩展。  

## 下载并构建扩展
```
git clone <此处填写仓库的网址>
cd <此处填写文件夹名称>
pnpm i
pnpm build
```
````

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
