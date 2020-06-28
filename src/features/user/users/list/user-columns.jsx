import React from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import CallToActionTwoToneIcon from "@material-ui/icons/CallToActionTwoTone";
import Avatar from "@material-ui/core/Avatar";
import { DoranPopover, DoranHtmlTooltip, toJalali } from "@doran/react";

// config
import { apiUrl } from "../../../../config.json";

const styles = {
    root: {
        width: 400,
        padding: "0px"
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
        fontSize: 18,
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
    position: {
        height: "20px"
    }
};

const trans = "users.list.userColumns";

export default function RenderColumns(props) {
    const { t: translate, contactTypes, status, onDelete, onEdit } = props;

    const columns = [
        {
            key: "id",
            label: translate(`${trans}.id`),
            content: (item, rowIndex) => (
                <DoranHtmlTooltip label={<Chip label={<strong>{`0${rowIndex + 1}`.slice(-2)}</strong>} />}>
                    <strong style={styles.tooltip}>{translate(`${trans}.idContent`, { id: item.id })}</strong>
                </DoranHtmlTooltip>
            )
        },
        {
            key: "avatar",
            label: translate(`${trans}.avatar`),
            content: (item) => (item.file ? <Avatar variant="rounded" src={`${apiUrl}/${item.file.url}`} /> : null)
        },
        {
            key: "fullName",
            label: translate(`${trans}.fullName`),
            content: (item) => {
                const gender = translate(`${trans}.genders.${item.gender}`);
                return `${gender} ${item.fullName}`;
            },
            width: "25%"
        },
        { key: "fatherName", path: "fatherName", label: translate(`${trans}.fatherName`), width: "20%" },
        { key: "nationalCode", path: "nationalCode", label: translate(`${trans}.nationalCode`), width: "10%" },
        { key: "username", path: "username", label: translate(`${trans}.username`), width: "20%" },
        {
            key: "status",
            label: translate(`${trans}.status`),
            content: (item) => status.find((e) => e.value === item.status).label,
            width: "15%"
        },
        {
            key: "extra",
            label: translate(`${trans}.extra`),
            content: (item) => (
                <DoranPopover Icon={CallToActionTwoToneIcon} iconStyle={styles.info}>
                    <List style={styles.root}>
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
                                <Grid item xs={4} style={styles.label}>
                                    {translate(`${trans}.birthDate`)}
                                </Grid>
                                <Grid item xs={8}>
                                    {toJalali(item.birthDate, "DD MMMM YYYY")}
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem divider style={styles.row}>
                            <Grid container>
                                <Grid item xs={4} style={styles.label}>
                                    {translate(`${trans}.maritalStatus`)}
                                </Grid>
                                <Grid item xs={8}>
                                    {translate(`${trans}.${item.isMarried ? "married" : "single"}`)}
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem divider style={styles.row}>
                            <Grid container>
                                <Grid item xs={4} style={styles.label}>
                                    {translate(`${trans}.positions`)}
                                </Grid>
                                <Grid item xs={8}>
                                    {item.positions &&
                                        item.positions.map((e, i) => (
                                            <Chip style={styles.position} label={e.name} key={i} />
                                        ))}
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
            content: (user) => (
                <div style={styles.buttonGroup}>
                    <ButtonGroup size="small" aria-describedby={user.id} style={styles.button}>
                        <Button variant="contained" color="primary" onClick={() => onEdit(user)}>
                            {translate(`${trans}.edit`)}
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => onDelete(user)}>
                            {translate(`${trans}.delete`)}
                        </Button>
                    </ButtonGroup>
                </div>
            )
        }
    ];

    return columns;
}
