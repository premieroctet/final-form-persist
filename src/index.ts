import { Decorator, FormApi } from "final-form"
import debounce from "lodash.debounce"

export interface FinalFormPersistOptions {
  name: string
  debounceTime?: number
  whitelist?: string[]
  storage?: Storage
}

export interface FinalFormPersistDecorator {
  persistDecorator: Decorator
  clear: () => void
  isPersisted: () => boolean
}

const persistDecorator = (options: FinalFormPersistOptions) => (form: FormApi) => {
  const { name, debounceTime = 0, whitelist = [], storage = localStorage } = options

  const persistedValues = storage.getItem(name) || "{}"
  const { initialValues } = form.getState()

  form.initialize({ ...initialValues, ...JSON.parse(persistedValues) })

  const unsubscribe = form.subscribe(
    debounce(({ values, pristine }) => {
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

      if (!pristine) {
        storage.setItem(name, JSON.stringify(valuesObject))
      }
    }, debounceTime, { leading: true, trailing: true }),
    { values: true, pristine: true },
  )

  return unsubscribe
}

export const createPersistDecorator = (options: FinalFormPersistOptions): FinalFormPersistDecorator => {
  const { name, storage = localStorage } = options
  if (!name) {
    throw new Error('createPersistDecorator expects a "name" option')
  }

  const clear = () => {
    storage.removeItem(name)
  }

  const isPersisted = () => !!storage.getItem(name)

  return {
    persistDecorator: persistDecorator(options),
    clear,
    isPersisted
  }
}
