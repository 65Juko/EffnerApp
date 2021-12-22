import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useColorScheme} from "react-native";
import {Themes} from "./ColorThemes";
import {load, save} from "../tools/helpers";

const ThemeContext = createContext({
    ...Themes.light,
    setTheme: () => {
    }
});

export function ThemeProvider({children}) {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState(systemTheme);

    useEffect(() => {
        load("theme").then(t => {
            if (t)
                setTheme(t);
        });
    }, []);

    const updateTheme = useCallback(theme => {
        save("theme", theme);
        setTheme(theme);
    });

    const memo = useMemo(() => {
        return {
            ...Themes[theme],
            setTheme: updateTheme
        };
    }, [theme, updateTheme]);

    return (
        <ThemeContext.Provider value={memo}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
