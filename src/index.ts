import { useCcl } from './useCcl';

export { useCcl };

declare global {
  /**
   * Class for the Cerner Windows COM Object for an XMLCclRequest.
   * Useful for development but not intended for production use.
   * [More Info](https://wiki.cerner.com/display/public/MPDEVWIKI/XMLCCLREQUEST)
   */
  class XMLCclRequest {
    options: Object;
    readyState: number;
    responseText: string;
    status: number;
    statusText: string;
    sendFlag: boolean;
    errorFlag: boolean;
    responseBody: string;
    responseXML: string;
    async: boolean;
    requestBinding: string;
    requestText: string;
    blobIn: string;
    url: string;
    method: string;
    requestHeaders: Object;
    requestLen: number;
    onreadystatechange: () => void;
    onerror: () => void;
    abort: () => void;
    getAllResponseHeaders: () => Array<string>;
    getResponseHeader: (header: string) => string;
    open(method: string, url: string, async?: boolean): void;
    send(data: string): void;
    setRequestHeader: (name: string, value: string) => void;
    cleanup: () => void;

    constructor(); // Allow using the `new` keyword
  }

  interface Window {
    readonly external: External;
  }

  interface External {
    /**
     * Funtion that returns a Cerner Windows COM object for an XMLCclRequest.
     * Useful for development but not intended for production use.
     */
    XMLCclRequest: () => XMLCclRequest;
  }
}
