import {
  CclCallParam,
  CclRequestResponse,
  XmlCclReadyState,
  XmlCclResult,
  makeCclRequestAsync,
} from 'easy-ccl-request';
import { useMemo, useState } from 'react';
import { mockMakeCclRequestAsync } from './utils';

/**
 * A custom React hook to make CCL calls to the Cerner PowerChart application lazily.
 * @param {string} prg  - the name of the CCL program to call.
 * @param opts - (optional) an object containing the poll interval and mock JSON
 * string.
 * - `excludeMine` - a boolean value to determine whether or not to include the
 * "MINE" parameter as the first parameter in the CCL request's argument list.
 * - `mockJSON` - a string representing the mock JSON data to return.
 * - `mode` - the mode to run the hook in. Options are 'production', 'development',
 * and 'auto'. In 'production' mode, the hook will make a real CCL request. In
 * 'development' mode, the hook will return the mock JSON data. In 'auto' mode,
 * the hook will determine the mode based on the environment. The default behavior
 * is 'auto' which behaves the same way as if the parameter is undefined.
 * @returns a hook object with the following properties:
 * - `loading` - a boolean value indicating whether the request is loading.
 * - `errors` - an array of error messages.
 * - `callback` - a function to call to make the CCL request.
 * - `abort` - a function to call to abort the CCL request.
 * - `inPowerChart` - a boolean value indicating whether the request is in PowerChart.
 * - `code` - the HTTP status code of the request.
 * - `result` - the result of the request.
 * - `status` - the status of the request.
 * - `details` - the details of the request.
 * - `data` - the data returned by the request.
 * - `__request` - the underlying XMLHttpRequest object used to make the request.
 */
export function useCclLazy<T>(
  prg: string,
  params: Array<CclCallParam | number | string> = [],
  opts?: {
    excludeMine?: boolean;
    mockJSON?: string;
    mode?: 'production' | 'development' | 'auto';
  }
): {
  loading: boolean;
  errors: Array<string>;
  callback: () => void;
  abort: () => void;
} & CclRequestResponse<T> {
  const { excludeMine, mockJSON, mode } = opts || {};
  const [__request, setRequest] = useState<XMLCclRequest>();
  const [code, setCode] = useState(418);
  const [data, setData] = useState<T>();
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<Array<string>>([]);
  const [inPowerChart, setInPowerChart] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<XmlCclResult>('im a teapot');
  const [status, setStatus] = useState<XmlCclReadyState>('uninitialized');

  // @eslint-ignore react-hooks/exhaustive-deps
  const memoizedParams = useMemo(() => params, []);

  function handleResponse(response: CclRequestResponse<T>) {
    setInPowerChart(response.inPowerChart);
    setCode(response.code);
    setResult(response.result);
    setStatus(response.status);
    setDetails(response.details);
    setData(response.data);
    setRequest(response.__request);
    setErrors([]);
  }

  function abort() {
    if (__request) {
      console.log('Attempting to abort request...');
      __request.abort();
    }
  }

  async function callback(): Promise<CclRequestResponse<T>> {
    if (mode === 'development' && !mockJSON) {
      setErrors(currentErrors => [
        ...currentErrors,
        'When in development mode, a mock JSON string must be provided.',
      ]);
    }

    const res: CclRequestResponse<T> = {
      inPowerChart,
      code,
      result,
      status,
      details,
      data,
      __request,
    };

    setLoading(true);

    if (mode === 'development' || (mode === 'auto' && import.meta.env.DEV)) {
      try {
        const response = await mockMakeCclRequestAsync<T>(mockJSON || '{}');
        handleResponse(response);
        return response;
      } catch (e) {
        if (e instanceof Error) {
          setErrors(currentErrors => [...currentErrors, (e as Error).message]);
        } else {
          throw e;
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await makeCclRequestAsync<T>(
          prg,
          memoizedParams,
          excludeMine
        );
        handleResponse(response);
        return response;
      } catch (e) {
        if (e instanceof Error) {
          setErrors(currentErrors => [...currentErrors, (e as Error).message]);
        } else {
          throw e;
        }
      } finally {
        setLoading(false);
      }
    }
    return res;
  }

  return {
    abort,
    callback,
    loading,
    errors,
    inPowerChart,
    code,
    result,
    status,
    details,
    data,
    __request,
  };
}
