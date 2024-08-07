# race-control

[![NPM version](https://img.shields.io/npm/v/race-control.svg?style=flat)](https://npmjs.com/package/race-control)
[![NPM downloads](http://img.shields.io/npm/dm/race-control.svg?style=flat)](https://npmjs.com/package/race-control)

race-control 是一个用于管理异步操作竞态条件的 JavaScript 工具。这个包帮助确保只有最新操作的结果会被应用，取消任何先前挂起的操作。

## Install

```bash
$ npm install race-control
```

## Usage

### simple

```javascript
import raceControl from "race-control";

const fetchData = (params, signal) => {
  return fetch("https://api.example.com/list", { params, signal });
};

const raceFetch = raceControl(fetchData, true);

raceFetch(params1).then(console.log);
raceFetch(params2).then(console.log);
```

### In React

```javascript
import raceControl from "race-control";

const fetchData = (params, signal) => {
  return fetch("https://api.example.com/list", { params, signal });
};

const raceFetch = raceControl(fetchData, true);

function SearchList() {
  const [list, setList] = useState([]);

  async function onInputHandle(e){
    raceFetch({ text: e.target.value }).then(data => setList(data))
  }

  return (
    <div>
      <input onInput={}/>
      <ul>
        {list.map((i) => (
          <li key={i.id}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Test Example

```typescript
let delay = [1000, 2000, 6000, 4000, 5000];
const mock = (count, abortSignal) =>
  new Promise((resolve) => setTimeout(() => resolve(count), delay[count]));

// 使用前
mock(0).then(console.log);
mock(1).then(console.log);
mock(2).then(console.log);
mock(3).then(console.log);
mock(4).then(console.log);
// 输出 0 1 3 4 2

// 使用后
const raceMock = raceControl(mock);
raceMock(0).then(console.log);
raceMock(1).then(console.log);
raceMock(2).then(console.log);
raceMock(3).then(console.log);
raceMock(4).then(console.log);
// 输出 4
```

## API

`raceControl(target, abortSignal)`
参数:

- `target` (Function): 一个返回 Promise 的异步函数，
- `abortSignal` (Boolean): 是否使用 AbortController 取消先前的操作。默认为 `false`。当该项为 `true` 时，target最后一个参数固定为 `AbortController.signal` 该项用于 `fetch` 的 `signal` 入参，详细请参考 `Usage` 的 `In React` 例子

`return`: 一个处理竞态条件的函数

## LICENSE

MIT
