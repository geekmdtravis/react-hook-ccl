import { CclRequestResponse } from 'easy-ccl-request';

/**
 * Mock function that simulates a CCL request by parsing a JSON string and
 * returning a promise that resolves to a CclRequestResponse object with the
 * data property set to the parsed JSON object.
 * @param json the JSON string to parse and return as an object
 * in the CclRequestResponse's data property.
 * @param ms the number of milliseconds to wait before resolving the promise.
 * @returns a promise that resolves to a CclRequestResponse object with the
 * data property set to the parsed JSON object.
 */
export async function mockMakeCclRequestAsync<T>(
  json: string,
  ms: number = 100
): Promise<CclRequestResponse<T>> {
  const response: CclRequestResponse<T> = {
    inPowerChart: false,
    code: 200,
    result: 'success',
    status: 'completed',
    details: '',
    data: undefined,
    __request: undefined,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        response.data = JSON.parse(json) as T;
        response.details = json;
        resolve(response);
      } catch (e) {
        if (e instanceof SyntaxError) {
          reject(new Error('Invalid JSON string.'));
        } else {
          throw e;
        }
      }
    }, ms);
  });
}
