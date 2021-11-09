import { useRef } from "react";

/**
 * This hook returns persistent function,
 * which proxy calls to mutable
 * callback.
 *
 * That's useful for registering event handlers
 * when you have to register callback just once
 * but closured values have to change for callback
 *
 * @example
 *  const [stateVar, setStateVar] = useState(0);
 *
 *  const myCallback = useRefCallback(() => {
 *    // stateVar value is in closure, and should be updated
 *    // on each function call
 *    setStateVar(stateVar + 1);
 *  });
 *
 *  // myCallback is persistent, so it will not cause unnecessary
 *  // re-renders and you can use it as a callback for events,
 *  // allowing multiple callback registrations, hence requiring
 *  // your particular callback being registered just once, but
 *  // not on each component re-render.
 *
 *  // Note that myCallback is persistent between renders,
 *  // but values in closures - are updated each render call.
 *
 *  useEffect(() => {
 *    someEvent.addEventHandler(myCallback);
 *  }, [myCallback]);
 *
*/
export default function useRefCallback(callback) {

    const cbRef = useRef();
    cbRef.current = callback;

    const proxyRef = useRef((...args) => {
        return cbRef.current(...args);
    });

    return proxyRef.current;
}
