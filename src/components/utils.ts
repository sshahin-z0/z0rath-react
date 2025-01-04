import EventEmitter from "events";
import {RefObject, useRef} from "react";

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export type EventsEmitter<E> = {
    addListener: <EE extends Extract<keyof E, string>>(
        event: EE,
        listener: (e: PropType<E, EE>) => void,
    ) => void;
    removeListener: <EE extends Extract<keyof E, string>>(
        event: EE,
        listener: (e: PropType<E, EE>) => void,
    ) => void;
    emit: <EE extends Extract<keyof E, string>>(
        event: EE,
        payload: PropType<E, EE>,
    ) => void;
    once?: <EE extends Extract<keyof E, string>>(
        event: EE,
        listener: (e: PropType<E, EE>) => void,
    ) => void;
    removeAllListeners?: <EE extends Extract<keyof E, string>>(event: EE) => void;
};

export function createEventsEmitter<
    Events extends { [event: string]: any },
>(): EventsEmitter<Events> {
    const eventEmitter = new EventEmitter();
    return {
        addListener: <Event extends Extract<keyof Events, string>>(
            event: Event,
            listener: (e: PropType<Events, Event>) => void,
        ) => {
            eventEmitter.addListener(event, listener);
        },
        removeListener: <Event extends Extract<keyof Events, string>>(
            event: Event,
            listener: (e: PropType<Events, Event>) => void,
        ) => {
            eventEmitter.removeListener(event, listener);
        },
        emit: <Event extends Extract<keyof Events, string>>(
            event: Event,
            payload: PropType<Events, Event>,
        ) => {
            eventEmitter.emit(event, payload);
        },
        once: <Event extends Extract<keyof Events, string>>(
            event: Event,
            listener: (e: PropType<Events, Event>) => void,
        ) => {
            eventEmitter.once(event, listener);
        },
        removeAllListeners: <Event extends Extract<keyof Events, string>>(
            event: Event,
        ) => {
            eventEmitter.removeAllListeners(event);
        },
    };
}


/*************************************************************
 * useRefProp will return a ref for a prop to ensure it has
 * its latest value, without triggering re-rendering
 */
export function useRefProp<S>(val: S): RefObject<S> {
    const ref = useRef<S>(val);
    ref.current = val;
    return ref;
}