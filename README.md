# final-form-persist

> Persist your form values into a storage

[![NPM](https://img.shields.io/npm/v/final-form-persist.svg)](https://www.npmjs.com/package/final-form-persist) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save final-form-persist
```

or

```bash
yarn add final-form-persist
```

## Usage

```tsx
import { createForm } from 'final-form'
import { createPersistDecorator } from 'final-form-persist'

const form = createForm({ onSubmit })

const persistDecorator = createPersistDecorator({
  name: 'myPersistKey'
  debounceTime: 500 // in ms
  whitelist: ['some', 'key']
  storage: localStorage // this is the default
})
```

## API

### `createPersistDecorator`

Creates a final form decorator.

```ts
createPersistDecorator = ({
  name: string;
  debounceTime?: number;
  whitelist: string[];
  storage?: Storage;
}) => Decorator<object>
```

## License

MIT © [premieroctet](https://github.com/premieroctet)
