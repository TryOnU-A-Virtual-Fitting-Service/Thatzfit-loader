declare global {
  interface Window {
    Thatzfit: IThatzfit;
    ThatzfitInitialized?: boolean;
  }
}

interface IThatzfit {
  command?: (...args: any) => void;
  queue?: [method: string, ...args: any[]][];
  (...args: any): void;
}

const isSSR = () => {
  if (typeof window === "undefined") {
    console.error("Thatzfit SDK Loader is not supported in SSR");
    return true;
  }
  return false;
};

const isSDKLoaded = () => {
  if (!window.Thatzfit) {
    console.error("Thatzfit SDK is not loaded");
    return false;
  }
  return true;
};

const safeExecuteThatzfit = (...args: unknown[]) => {
  if (isSSR() || !isSDKLoaded()) {
    return;
  }
  window.Thatzfit.command?.(...args);
};

export const loadScript = () => {
  if (isSSR()) {
    return;
  }

  (() => {
    const w = window;
    if (!!w.Thatzfit) {
      return;
    }

    const thatzfit: IThatzfit = function () {
      thatzfit.command?.(...arguments);
    };

    thatzfit.queue = [];
    thatzfit.command = (args) => {
      thatzfit.queue?.push(args);
    };
    w.Thatzfit = thatzfit;

    const load = () => {
      if (w.ThatzfitInitialized) {
        return;
      }
      w.ThatzfitInitialized = true;

      const s = document.createElement("script");
      s.type = "text/javascript";
      s.defer = true;
      s.src = "https://cdn.thatzfit.com/plugin/ThatzfitSDKInjector.js";

      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript.parentNode) {
        firstScript.parentNode.insertBefore(s, firstScript);
      }
    };

    if (document.readyState === "complete") {
      load();
    } else {
      w.addEventListener("DOMContentLoaded", load);
      w.addEventListener("load", load);
    }
  })();
};

export interface BootOption {
  pluginKey: string;
}

export const boot = (option: BootOption) => {
  safeExecuteThatzfit("boot", option);
};

export const shutdown = () => {
  safeExecuteThatzfit("shutdown");
};
