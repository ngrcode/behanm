import React from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import CallToActionTwoToneIcon from "@material-ui/icons/CallToActionTwoTone";
import { DoranPopover, DoranHtmlTooltip, DoranSplitButton, DoranMap, toJalali } from "@doran/react";
import "@doran/react/dist/leaflet/leaflet.css";

const styles = {
    root: {
        width: 400,
        padding: "0px"
    },
    title: {
        fontSize: "13px",
        textDecoration: "none"
    },
    row: {
        flexGrow: 1,
        fontSize: "12px"
    },
    label: {
        fontWeight: "bold"
    },
    tooltip: {
        color: "red"
    },
    info: {
        color: "green"
    },
    icon: {
        fontSize: "18px",
        color: "green",
        marginTop: 4
    },
    buttonGroup: {
        display: "flex"
    },
    buttonGroupItem: {
        fontSize: "12px"
    },
    button: {
        marginLeft: "2px"
    },
    map: {
        height: "200px"
    }
};

const trans = "schools.list.schoolColumns";

export default function RenderColumns(props) {
    const { t: translate, onDelete, onEdit, onRedirect, contactTypes } = props;

    const columns = [
        {
            key: "id",
            label: translate(`${trans}.id`),
            content: (item, index) => (
                <DoranHtmlTooltip label={<Chip label={<strong>{`0${index + 1}`.slice(-2)}</strong>} />}>
                    <strong style={styles.tooltip}>{translate(`${trans}.idContent`, { id: item.id })}</strong>
                </DoranHtmlTooltip>
            ),
            width: "5%"
        },
        { key: "title", label: translate(`${trans}.title`), content: (item) => item.title, width: "25%" },
        {
            key: "educationComplex",
            label: translate(`${trans}.educationComplex`),
            content: (item) => item.educationComplex && item.educationComplex.name,
            width: "15%"
        },
        { key: "region", label: translate(`${trans}.region`), content: (item) => item.region.name, width: "15%" },
        { key: "howze", label: translate(`${trans}.howze`), content: (item) => item.howze.name, width: "15%" },
        { key: "mosque", label: translate(`${trans}.mosque`), content: (item) => item.mosque.title, width: "15%" },
        {
            key: "extra",
            label: translate(`${trans}.extra`),
            content: (item) => (
                <DoranPopover Icon={CallToActionTwoToneIcon} iconStyle={styles.info}>
                    <List style={styles.root}>
                        {item.coordinate.length > 0 && (
                            <ListItem style={styles.map}>
                                <DoranMap
                                    name="coordinate"
                                    zoom={10}
                                    center={item.coordinate[0]}
                                    points={item.coordinate}
                                    onChange={() => {}}
                                />
                            </ListItem>
                        )}
                        <ListItem divider style={styles.row}>
                            <Grid container>
                                <Grid item xs={4} style={styles.label}>
                                    {translate(`${trans}.creator`)}
                                </Grid>
                                <Grid item xs={8}>
                                    {item.creator && `${item.creator.firstName} ${item.creator.lastName}`}
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem divider style={styles.row}>
                            <Grid container>
                                <Grid item xs={4} style={styles.label}>
                                    {translate(`${trans}.createdAt`)}
                                </Grid>
                                <Grid item xs={8}>
                                    {toJalali(item.createdAt, "DD MMMM YYYY")}
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem divider style={styles.row}>
                            <Grid container>
                                <Grid item xs={4} style={styles.label}>
                                    {translate(`${trans}.modifier`)}
                                </Grid>
                                <Grid item xs={8}>
                                    {item.modifier && `${item.modifier.firstName} ${item.modifier.lastName}`}
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem divider style={styles.row}>
                            <Grid container>
                                <Grid item xs={4} style={styles.label}>
                                    {translate(`${trans}.modifiedAt`)}
                                </Grid>
                                <Grid item xs={8}>
                                    {toJalali(item.modifiedAt, "DD MMMM YYYY")}
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem divider style={styles.row}>
                            <Grid container>
                                <Grid item xs={12} style={styles.label}>
                                    {translate(`${trans}.contacts`)}
                                </Grid>
                                <Grid item xs={12}>
                                    <List>
                                        {item.contact &&
                                            item.contact.map((e, i) => (
                                                <ListItem style={styles.row} key={i}>
                                                    <Grid container>
                                                        <Grid item xs={4} style={styles.label}>
                                                            {contactTypes.find((ct) => ct.value === +e.type).label}
                                                        </Grid>
                                                        <Grid item xs={8}>
                                                            {e.value}
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                            ))}
                                    </List>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                </DoranPopover>
            ),
            width: "5%"
        },
        {
            key: "operations",
            label: translate(`${trans}.operations`),
            content: (item) => (
                <div style={styles.buttonGroup}>
                    <ButtonGroup size="small" aria-describedby={item.id} style={styles.button}>
                        <Button variant="contained" color="primary" onClick={() => onEdit(item)}>
                            {translate(`${trans}.edit`)}
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => onDelete(item)}>
                            {translate(`${trans}.delete`)}
                        </Button>
                    </ButtonGroup>
                    <DoranSplitButton color="primary" title={translate(`${trans}.operation`)}>
                        <MenuList>
                            <MenuItem
                                key="lessons"
                                style={styles.buttonGroupItem}
                                onClick={() => onRedirect(item, `/schools/${item.id}/lessons`)}
                            >
                                {translate(`${trans}.lessons`)}
                            </MenuItem>
                            <MenuItem
                                key="rooms"
                                style={styles.buttonGroupItem}
                                onClick={() => onRedirect(item, `/schools/${item.id}/rooms`)}
                            >
                                {translate(`${trans}.rooms`)}
                            </MenuItem>
                            <MenuItem
                                key="teachers"
                                style={styles.buttonGroupItem}
                                onClick={() => onRedirect(item,`/users`,`TEACHER`)}
                            >
                                {translate(`${trans}.teachers`)}
                            </MenuItem>
                            <MenuItem
                                key="students"
                                style={styles.buttonGroupItem}
                                onClick={() => onRedirect(item,`/users`,`STUDENT`)}
                            >
                                {translate(`${trans}.students`)}
                            </MenuItem>
                             <MenuItem
                                key="parents"
                                style={styles.buttonGroupItem}
                                onClick={() => onRedirect(item,`/users`,`PARENT`)}
                            >
                                {translate(`${trans}.parents`)}
                            </MenuItem>  
                            <MenuItem
                                key="managers"
                                style={styles.buttonGroupItem}
                                onClick={() => onRedirect(item,`/users`,`MANAGER`)}
                            >
                                {translate(`${trans}.managers`)}
                            </MenuItem> 
                        </MenuList>
                    </DoranSplitButton>
                </div>
            ),
            width: "10%"
        }
    ];

    return columns;
}
