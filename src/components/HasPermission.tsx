import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { socketConsumers } from "./SocketListener";
import { useRefProp } from "./utils";
import {useZ0rath} from "./Z0rathContext";

const useHasPermission = (slug: string) => {
  const { user, apiKey } = useZ0rath();
  const [hasPermission, setHasPermission] = useState<boolean>();
  const abortControllerRef = useRef<AbortController | null>(null); // Reference to hold the controller
  const fetchPermission = useCallback(() => {
    if (!user) {
      setHasPermission(false);
      return;
    }
    const url = `https://z0rath-api.zonezero.dev/api/v1/authorization/has_permission?user=${user}&slug=${slug}`;
    abortControllerRef.current?.abort(); // Abort the request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      credentials: "omit",
      signal: abortControllerRef.current?.signal
    })
        .then(async (response) => {
          if (!response.ok) {
            if (response.status === 403) {
              // doesn't have access
              setHasPermission(false);
            } else {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
          } else {
            const data = await response.json();
            setHasPermission(data.hasPermission);
          }
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            return;
          }
          console.error("Error fetching permission:", error);
        });
  }, [slug, user, apiKey]);
  useEffect(() => {
    fetchPermission();
    return ()=>{
      abortControllerRef.current?.abort();
    }
  }, [fetchPermission]);

  const fetchPermissionRef = useRefProp(fetchPermission);
  const listener = useCallback(() => fetchPermissionRef.current(), []);
  useEffect(() => {
    fetchPermission();
    socketConsumers.addListener("INVALIDATE_PERMISSIONS", listener);
    return () => {
      socketConsumers.removeListener("INVALIDATE_PERMISSIONS", listener);
    };
  }, []);
  return hasPermission;
};

const HasPermission: React.FC<
  PropsWithChildren<{
    slug: string;
    noPermissionCallback?: (redirect: boolean) => void;
  }>
> = ({ slug, noPermissionCallback, children }) => {
  const hasPermission = useHasPermission(slug);
  let redirect = false;
  const ref = useRef(hasPermission);
  if (ref.current && !hasPermission) {
    redirect = true;
  }
  ref.current = hasPermission;
  if (!hasPermission) {
    noPermissionCallback?.(redirect);
    return null;
  }
  return children;
};

export default HasPermission;
