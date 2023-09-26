import { useEffect, useState } from "react";

export default function useBrowser() {
    const [isSafari, setSafari] = useState(false)
    useEffect(() => {
        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
            setSafari(true)
        } else {
            setSafari(false)
        }
    }, [])

    return {
        isSafari
    }
}