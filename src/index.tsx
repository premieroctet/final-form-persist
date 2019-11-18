import { Decorator, FormApi } from "final-form"
import debounce from "lodash.debounce"

interface FinalFormPersistOptions {
  name: string
  debounceTime?: number
  whitelist?: string[]
  storage?: Storage
}

const createPersistDecorator = (options: FinalFormPersistOptions): Decorator => (form: FormApi) => {
  const { name, debounceTime = 0, whitelist = [], storage = localStorage } = options
  const persistedValues = storage.getItem(name) || "{}"
  const { initialValues } = form.getState()

  form.initialize({ initialValues, ...JSON.parse(persistedValues) })

  const unsubscribe = form.subscribe(
    debounce(({ values }) => {
      let valuesKeys = Object.keys(values)
      if (whitelist.length > 0) {
        valuesKeys = Object.keys(values).filter(value => whitelist.includes(value))
      }
      const valuesObject = valuesKeys.reduce((acc, key) => {
        return {
          ...acc,
          [key]: values[key],
        }
      }, {})

      storage.setItem(name, JSON.stringify(valuesObject))
    }, debounceTime),
    { values: true },
  )

  return unsubscribe
}

export { createPersistDecorator }
