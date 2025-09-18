import { boot, loadScript } from "."

export const test = () => {
    loadScript();
    boot({
        pluginKey:'test'
    });
}

test();