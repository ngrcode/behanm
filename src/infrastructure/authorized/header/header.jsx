import React from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { withTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import authService from "../../../core/services/auth.service";
import { Avatar, Badge } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { MenuItem } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";


const transPrefix = "authorized.header.header";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 0,
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
    hide: {
        display: "none",
    },
    title: {
        flexGrow: 1,
        marginLeft: theme.spacing(2),
    },
    avatar: {
        marginRight: theme.spacing(6),
    },
    buttonGroupItem: {
        fontSize: "12px",
    },
}));

const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "$ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}))(Badge);

function Header({ t: translate, open, onDrawerState }) {
    const classes = useStyles();
    const history = useHistory();

    const handleDrawerOpen = () => {
        onDrawerState(true);
    };
    const redirect = (data, path) => {
        history.push(path, data);
    };
   
    const [anchorEl, setAnchorEl] = React.useState(null);

    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const jwtDecoded = authService.currentUser();

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleDrawerOpen}
                        className={clsx(open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {translate(`${transPrefix}.title`)}
                    </Typography>
                    <StyledBadge
                        className={classes.avatar}
                        overlap="circle"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        variant="dot"
                    >
                        <Avatar alt="Remy Sharp" src="https://fakeimg.pl/50x50/" onClick={handleClick} />
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                              }}
                        >
                            <MenuItem
                                className={classes.buttonGroupItem}
                                onClick={() => redirect(jwtDecoded, `/users/${jwtDecoded.username}`)}
                            >
                                پروفایل کاربر
                            </MenuItem>
                            <MenuItem className={classes.buttonGroupItem} onClick={handleClose}>
                                تغییر رمز
                            </MenuItem> 
                            <MenuItem className={classes.buttonGroupItem} onClick={() => authService.logout(history)}>
                                {translate(`${transPrefix}.logout`)}
                            </MenuItem>
                        </Menu>   
                    </StyledBadge>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default withTranslation("infrastructure")(Header);
