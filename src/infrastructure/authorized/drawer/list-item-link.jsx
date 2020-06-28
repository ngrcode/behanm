import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

function ListItemLink(props) {
    // console.log(props);
    const [expand, setExpand] = React.useState(false);

    const { keyValue, text, children, href, onClick } = props;
    const { Icon, iconClass } = props;

    const handleItemClick = (url) => {
        setExpand(!expand);
        
        if (onClick) {
            onClick(url);
        }
    };


    if (!children) {
        const linkAttributes = { component: "a", key: keyValue, onClick: () => handleItemClick(href) };
        return (
            <ListItem button {...linkAttributes}>
                <ListItemIcon className={iconClass}>
                    <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
            </ListItem>
        );
    }

    const collasableAttributes = { key: keyValue, onClick: () => handleItemClick() };
    return (
        <React.Fragment>
            <ListItem button {...collasableAttributes}>
                <ListItemIcon className={iconClass}>
                    <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
                {expand ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expand} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </React.Fragment>
    );
}

export default ListItemLink;
