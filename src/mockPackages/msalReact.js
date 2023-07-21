import { useIsAuthenticated, useMsal } from "@azure/msal-react";

export default function mockAuthentication () {
    
    useIsAuthenticated.mockReturnValue(true);

    useMsal.mockReturnValue({
        instance: {
            acquireTokenSilent: jest.fn()
        },
        accounts: [{
            username: "Byron@choice.aero"
        }]
    });
}

