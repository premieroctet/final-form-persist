import { Decorator, FormApi } from "final-form"
import debounce from "lodash.debounce"

export interface FinalFormPersistOptions<FormValues = object> {
  name: string
  debounceTime?: number
  whitelist?: Array<keyof FormValues>
  blacklist?: Array<keyof FormValues>
  storage?: Storage
}

export interface FinalFormPersistDecorator<FormValues = object> {
  persistDecorator: Decorator<FormValues>
  clear: () => void
  isPersisted: () => boolean
}

const persistDecorator = <FormValues = object>(
  options: FinalFormPersistOptions<FormValues>
) => (form: FormApi<FormValues>) => {
  const {
    name,
    debounceTime = 0,
    whitelist = [],
    storage = localStorage,
    blacklist = [],
  } = options

  const persistedValues = storage.getItem(name) || "{}"
  const { initialValues } = form.getState()

  form.initialize({ ...initialValues, ...JSON.parse(persistedValues) })

  const unsubscribe = form.subscribe(
    debounce(
      ({ values, pristine }) => {
        let valuesKeys = Object.keys(values) as Array<keyof FormValues>
        if (whitelist.length > 0 && !blacklist.length) {
          valuesKeys = (Object.keys(values) as Array<
            keyof FormValues
          >).filter((value) => whitelist.includes(value))
        }
        if (blacklist.length > 0) {
          valuesKeys = (Object.keys(values) as Array<keyof FormValues>).filter(
            (value) => !blacklist.includes(value)
          )
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
      },
      debounceTime,
      { leading: true, trailing: true }
    ),
    { values: true, pristine: true }
  )

  return unsubscribe
}

export const createPersistDecorator = <FormValues = object>(
  options: FinalFormPersistOptions<FormValues>
): FinalFormPersistDecorator<FormValues> => {
  const { name, storage = localStorage } = options
  if (!name) {
    throw new Error('createPersistDecorator expects a "name" option')
  }

  const clear = () => {
    storage.removeItem(name)
  }

  const isPersisted = () => !!storage.getItem(name)

  return {
    persistDecorator: persistDecorator<FormValues>(options),
    clear,
    isPersisted,
  }
}
