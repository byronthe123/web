import { useState, useEffect } from 'react';

export default function useFriendStatus(friendID) {
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
        setIsOnline(true);
    });

    return isOnline;
}