import * as React from "react";
import {SVGAttributes, useEffect, useRef, useState} from "react";
import {createEventsEmitter} from "./utils";
import {useZ0rath} from "./Z0rathContext";

type EventsType = {
    INVALIDATE_PERMISSIONS: any;
    INVALIDATE_ATTRIBUTES: any;
};

export const socketConsumers = createEventsEmitter<EventsType>();

const SVGComponent = (props: SVGAttributes<any>) => (
    <svg
        height={32}
        style={{
            overflow: "visible",
        }}
        viewBox="0 0 32 32"
        width={32}
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle
            cx={16}
            cy={16}
            r={16}
            style={{
                fill: "#d72828",
            }}
        />
        <path
            d="M14.5 25h3v-3h-3zm0-19v13h3V6z"
            style={{fill: "#e6e6e6"}}
        />
    </svg>
);


const SocketListener = () => {
    const {apiKey, user} = useZ0rath();
    const [error, setError] = useState<string | null>(null);
    const [ticket, setTicket] = useState<string | null>(null);
    const wsRef = useRef<any>(null);
    const abortControllerRef = useRef<AbortController | null>(null); // Reference to hold the controller

    useEffect(() => {
        if (!ticket) return;
        const ws = new WebSocket(
            `wss://z0rath-api.zonezero.dev/api/v1/websockets/ws?ticket=${ticket}`,
        );
        wsRef.current = ws;
        ws.onopen = () => {
            console.debug("WebSocket connection established");
        };
        ws.onmessage = (event) => {
            try {
                const jsonEvent = JSON.parse(event.data);
                switch (jsonEvent.action) {
                    case "invalidate-permissions":
                        socketConsumers.emit("INVALIDATE_PERMISSIONS", event);
                        break;
                    case "invalidate-attributes":
                        socketConsumers.emit("INVALIDATE_ATTRIBUTES", event);
                        break;
                }
            } catch (e) {
                console.error(e);
            }
        };
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
        ws.onclose = () => {
            console.debug("WebSocket connection closed");
        };
        return () => {
            wsRef.current?.close();
        }
    }, [ticket]);

    useEffect(() => {
        if (!user) return;
        const fetchTicket = async () => {
            try {
                abortControllerRef.current?.abort(); // Abort the request
                const abortController = new AbortController();
                abortControllerRef.current = abortController;
                const response = await fetch("https://z0rath-api.zonezero.dev/api/v1/websockets/issue-ticket", {
                    method: 'POST',
                    headers: {
                        "x-api-key": apiKey,
                    },
                    body: JSON.stringify({user: user}),
                    signal: abortController.signal
                });
                // Now establish the WebSocket connection
                const result = await response.json();
                setTicket(result.ticket);
                setError(null);
            } catch (error: any) {
                if (error.name === "AbortError") {
                    return;
                }
                setError("Unable to establish connection");
                console.error("Error fetching ticket:", error);
            }
        };
        fetchTicket();
        return () => {
            abortControllerRef.current?.abort(); // Abort the request
        }
    }, [user, apiKey]);
    return <>{error !== null ? <SVGComponent
        style={{
            position: "absolute",
            width: 20,
            height: 20
        }}/> : null}</>;
};

export default SocketListener;
