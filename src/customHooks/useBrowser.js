import { useEffect, useState } from "react";

export default function useBrowser () {
    const [browser, setBrowser] = useState('');

    useEffect(() => {
        const agent = window.navigator.userAgent.toLowerCase();
        let browser;
        if (agent.includes('firefox')) {
          browser = 'Firefox';
        } else if (agent.includes('edg')) {
          browser = 'Edge';
        } else {
          browser = 'Chrome';
        }
        setBrowser(browser);
    }, []);

    return browser;
}