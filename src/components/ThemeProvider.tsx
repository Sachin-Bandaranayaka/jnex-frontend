'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3B82F6', // blue-500
        },
        secondary: {
            main: '#10B981', // emerald-500
        },
    },
});

export default function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
} 