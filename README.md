# final-form-persist

> Persist your final-form values into a storage

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

const { persistDecorator, clear } = createPersistDecorator({
  name: 'myPersistKey',
  debounceTime: 500, // in ms
  whitelist: ['some', 'key'],
  storage: localStorage // this is the default
})

const undecorate = persistDecorator(form)

// Use form

// Remove the entry from the storage if you want
clear()

// Clean up
undecorate()
```

## Example

[Example](https://codesandbox.io/s/final-form-persist-example-s4wz5) build with [react-final-form](https://github.com/final-form/react-final-form)

## API

### `createPersistDecorator`

Creates a final form decorator.

```ts
createPersistDecorator = ({
  name: string
  debounceTime?: number
  whitelist: string[]
  storage?: Storage
}) => FinalFormPersistDecorator
```

### type `FinalFormPersistDecorator`

```ts
{
  persistDecorator: Decorator
  clear: () => void
  isPersisted: boolean
}
```

## License

MIT © [premieroctet](https://github.com/premieroctet)
