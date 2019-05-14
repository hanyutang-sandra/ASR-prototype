import React from 'react';
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import lightBlue from '@material-ui/core/colors/lightBlue';
import grey from '@material-ui/core/colors/grey';
import CssBaseline from '@material-ui/core/CssBaseline';


const theme = createMuiTheme({
    palette: {
        primary: {
            light: lightBlue[100],
            main: lightBlue[300],
            dark: lightBlue[600]
        },
        secondary: {
            light: grey[100],
            main: grey[300],
            dark: grey[500]
        }
    },
    typography: {
        useNextVariants: true,
    }
});


function withRoot(Component) {
    function WithRoot(props){
        return (
            <MuiThemeProvider theme={ theme }>
                <CssBaseline />
                <Component {...props} />
            </MuiThemeProvider>
        )
    }

    return WithRoot
}

export default withRoot;