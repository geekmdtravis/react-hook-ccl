# `react-hook-useCcl`

_Author: Travis Nesbit, MD ([@geekmdtravis](https://github.com/geekmdtravis/))_

## Overview

A useful React hook written in TypeScript which wraps the `XMLCclRequest` exposed as a native function
to the Microsoft Edge Chromium Browser in the _Cerner Discern_ environment (e.g. _PowerChart_). Of note, this hook is only intended for use within the _Cerner Discern_ environment and it will not work in other environments. Additionally, while it _might_ work in other browsers like Microsoft Internet Explorer, it is untested in t hem and is only currently being developed for compatibility with the Microsoft Edge Chromium Browser.

## Example usage:

```tsx
function App() {
  const { data, loading, errors } = useCcl<UserData>('00_GET_USER_DATA', [123]);

  return (
    <div>
      <h2>Example Response</h1>
      {loading && <p>Fetching data...</p>}
      {data && (
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      )}
      {errors.length > 0 && (
        <>
          <h2>Errors:</h2>
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
```

## Parameters and Options

- `prg`: The CCL program to call.
- `params`: An array of parameters to pass to the CCL program. These can be the structured `CclCallParam` objects, or simple `string` and `number` types.
- `opts`: An optional object containing the following options:
  - `pollInterval`: The interval in milliseconds to poll the server for a response. The default value is `undefined` and will not poll the server. A value of zero also disables polling. This is useful for scripts that might need to update the UI in regular intervals so that the information is always up-to-date.
  - `excludeMine`: Whether to exclude the current user's data from the response. Default is `false`.
  - `mockJSON`: A string of JSON to use as a mock response. This is useful for testing the hook without needing to make a real CCL call.
  - `mode`: The mode to use for the CCL call. Default is `'auto'`. This can be set to `'production'` or `'development'` to force the mode. When in `'auto'` mode, the hook will use environment variables to determine the mode. That is, if the app is determined to be in `'development'` environment the hook will attempt to load mock CCL data which should be provided by the developer as a JSON string in the `mockJSON` option. If the app is determined to be in `'production'` environment, the hook will make a real CCL call to the server.

## Return Value

- `loading`: A boolean indicating whether the request is still loading.
- `errors`: An array of strings containing any errors that occurred during the request.
- `abort`: A function that can be called to abort the request.
- `inPowerChart`: A boolean indicating whether the hook is running in the _Cerner Discern_ environment.
- `code`: The numeric code of the response. This defaults to `418` before the request is complete.
- `result`: a `string` value representing the result of the response. This will be `unknown` until the request is `complete`. The full set of values that can be returned are:
  - `im a teapot` - corresponds to a `418` status code and is used when attempting to query the server outside of the PowerChart environment without targeting mock data.
  - `internal server exception` - corresponds to a `500` status code.
  - `invalid state` - corresponds to a `409` status code.
  - `memory error` - corresponds to a `493` status code.
  - `method not allowed` - corresponds to a `405` status code.
  - `non-fatal error` - corresponds to a `492` status code.
  - `success` - corresponds to a `200` status code.
  - `unknown` - does not correspond to any specific status code and generally indicates the result is not yet known because the request may not have resolved or been run.
- `status`: a `string` representing the _ready state_ of the underlying `XMLCclRequest`. This will be `uninitialized` until the request is initialized. The full set of potential status values are:
  - `uninitialized` - corresponds to a `0` status code.
  - `loading` - corresponds to a `1` status code.
  - `loaded` - corresponds to a `2` status code.
  - `interactive` - corresponds to a `3` status code.
  - `complete` - corresponds to a `4` status code.
- `details`: a `string` value which represents the full status text (response in string form) of the response. This will be an empty string until the request is complete.
- `data`: an `Object` which represenets the response data from the CCL call. This will be `undefined` until the request is complete. When using _TypeScript_ this object will be of type `T`.
- `__request`: The underlying `XMLCclRequest` object. This is exposed for advanced users who may need to interact with the request object directly.
