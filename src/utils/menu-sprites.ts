import { api } from "clipcc-extension";

export const menuSprites: DynamicMenu = () => {
    const VM = api.getVmInstance() as {
        runtime: {
            targets: {
                isOriginal: boolean
                isStage: boolean
                sprite: {
                    name: string;
                    [key: string]: any
                };
                [key: string]: any
            }[];
            [key: string]: any
        };
        [key: string]: any
    }

    const out = VM.runtime.targets
        .filter((target) => target.isOriginal && !target.isStage)
        .map((target): [string, string] => [target.sprite.name, target.sprite.name])

    return out.length ? out : [['', '']]
}
