import { EventEmitter } from 'node:events'

const bus = new EventEmitter()

export const publishEvent = (eventName, payload) => {
    bus.emit(eventName, payload)
}

export const onEvent = (eventName, handler) => {
    bus.on(eventName, handler)
}

export const onceEvent = (eventName, handler) => {
    bus.once(eventName, handler)
}
