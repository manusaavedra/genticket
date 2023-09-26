import { useState } from "react";

export default function useInput(defaultValue = '') {
    const [value, setValue] = useState(defaultValue)

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    return {
        value,
        setValue,
        handleChange
    }
}