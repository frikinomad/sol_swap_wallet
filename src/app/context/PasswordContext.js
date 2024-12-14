'use client';

import { createContext, useContext, useState } from 'react';

// Create the context with default values
export const PasswordContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {}
});

export function PasswordContextProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <PasswordContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </PasswordContext.Provider>
    );
}

export default function usePassword() {
    return useContext(PasswordContext);
}