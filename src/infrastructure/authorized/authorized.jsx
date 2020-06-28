import React from "react";
import clsx from "clsx";
import { withTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "./drawer/drawer";
import Header from "./header/header";
import Body from "./body/body";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    content: {
        flexGrow: 1,
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2),
            paddingTop: theme.spacing(10),
        },
        [theme.breakpoints.up("md")]: {
            padding: theme.spacing(8),
            paddingTop: theme.spacing(10),
        },
        [theme.breakpoints.up("lg")]: {
            padding: theme.spacing(20),
            paddingTop: theme.spacing(10),
        },
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: 0,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
}));

function Authorized() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const toggleDrawerState = (state) => {
        setOpen(state);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Header open={open} onDrawerState={toggleDrawerState} />
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <Body />
            </main>
            <Drawer open={open} onDrawerState={toggleDrawerState} />
        </div>
    );
}

export default withTranslation("infrastructure")(Authorized);
