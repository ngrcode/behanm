import React from "react";
import { useHistory } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { default as MaterialDrawer } from "@material-ui/core/Drawer";
import { Divider, IconButton, List } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItemLink from "./list-item-link";
import { default as UsersIcon } from "@material-ui/icons/PeopleAltTwoTone";
import { default as RegionsIcon } from "@material-ui/icons/LocationOnTwoTone";
import { default as PostsIcon } from "@material-ui/icons/DescriptionTwoTone";
import { default as BannersIcon } from "@material-ui/icons/ViewCarouselTwoTone";
import { default as CategoriesIcon } from "@material-ui/icons/ViewCarouselTwoTone";
import { default as SchoolsIcon } from "@material-ui/icons/SchoolTwoTone";
import { default as MosquesIcon } from "@material-ui/icons/LocationCityTwoTone";

const transPrefix = "authorized.drawer.drawer";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        justifyContent: "flex-end",
        ...theme.mixins.toolbar,
    },
    listIcon: {
        minWidth: 36,
    },
    nestedList: {
        paddingLeft: 36,
    },
    profileButton: {
        textDecoration: "none",
        fontWeight: "bold",
    },
}));

function Drawer({ t: translate, open, onDrawerState, ...rest }) {
    const classes = useStyles();
    const handleCloseClick = () => onDrawerState(false);
    const trans = (suffix) => translate(`${transPrefix}.${suffix}`);
    const history = useHistory();
    const handleNavigate = (url) => {
        history.push(url);
    };
    const attrs = {
        className: classes.drawer,
        variant: "persistent",
        anchor: "left",
        open,
    };
    return (
        <MaterialDrawer {...attrs} classes={{ paper: classes.drawerPaper }}>
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleCloseClick}>
                    <ChevronRightIcon />
                </IconButton>
            </div>
            <Divider />
            <List disablePadding>
                <ListItemLink
                    keyValue="users"
                    href="/users"
                    onClick={handleNavigate}
                    Icon={UsersIcon}
                    iconClass={classes.listIcon}
                    text={trans("users")}
                />
                <ListItemLink
                    keyValue="regions"
                    href="/regions"
                    onClick={handleNavigate}
                    Icon={RegionsIcon}
                    iconClass={classes.listIcon}
                    text={trans("regions")}
                />
                <ListItemLink
                    keyValue="mosques"
                    href="/mosques"
                    onClick={handleNavigate}
                    Icon={MosquesIcon}
                    iconClass={classes.listIcon}
                    text={trans("mosques")}
                />
                <ListItemLink
                    key="education-complexes"
                    href="/education-complexes"
                    onClick={handleNavigate}
                    Icon={CategoriesIcon}
                    iconClass={classes.listIcon}
                    text={trans("educationComplexes")}
                />
                <ListItemLink
                    keyValue="schools"
                    href="/schools"
                    onClick={handleNavigate}
                    Icon={SchoolsIcon}
                    iconClass={classes.listIcon}
                    text={trans("schools")}
                />
            </List>
            <Divider />
            <List disablePadding>
                <ListItemLink
                    key="categories"
                    href="/categories"
                    onClick={handleNavigate}
                    Icon={CategoriesIcon}
                    iconClass={classes.listIcon}
                    text={trans("categories")}
                />
                <ListItemLink
                    key="posts"
                    href="/posts"
                    onClick={handleNavigate}
                    Icon={PostsIcon}
                    iconClass={classes.listIcon}
                    text={trans("posts")}
                />
                <ListItemLink
                    key="comments"
                    href="/comments"
                    onClick={handleNavigate}
                    Icon={PostsIcon}
                    iconClass={classes.listIcon}
                    text={trans("comments")}
                />
                <ListItemLink
                    key="banners"
                    href="/banners"
                    onClick={handleNavigate}
                    Icon={BannersIcon}
                    iconClass={classes.listIcon}
                    text={trans("banners")}
                />
            </List>
        </MaterialDrawer>
    );
}

export default withTranslation("infrastructure")(Drawer);
