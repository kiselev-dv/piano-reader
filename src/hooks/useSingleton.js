import { useRef } from "react";

export default function useSingleton(value) {
    const ref = useRef(value);
    return ref.current;
}