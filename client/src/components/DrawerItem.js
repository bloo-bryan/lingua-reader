import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useState} from "react";
import {NavLink} from "react-router-dom";
import {useDispatch} from "react-redux";

const DrawerItem = ({text, icon, open, path}) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#252c7b',
                light: '#F0C04F',
                dark: '#252c7b',
            },
            secondary: {
                main: '#f50057',
            },
            background: {
                default: '#252c7b',
                paper: '#1d2033',
            },
            text: {
                primary: '#F0C04F',
            },
            divider: '#fff',
        },

    });
    const [hover, setHover] = useState(false);
    const dispatch = useDispatch();

    return (
        <ThemeProvider theme={theme}>
            <List>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <NavLink to={path} style={{textDecoration: 'none'}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                ":hover": {
                                    backgroundColor: 'rgba(240, 192, 78, 0.9)'
                                }
                            }}
                            onMouseOver={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: hover ? 'white' : '#F0C04F',
                                }}
                            >
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0, color: hover ? 'white' : '#F0C04F' }} />
                        </ListItemButton>
                    </NavLink>
                </ListItem>
            </List>
        </ThemeProvider>
    )
}

export default DrawerItem;