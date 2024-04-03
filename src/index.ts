import { useCcl } from './useCcl';
import { useCclLazy } from './useCclLazy';

export { useCcl, useCclLazy };

declare global {
  interface ImportMetaEnv {
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
