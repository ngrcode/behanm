import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import CallToActionTwoToneIcon from "@material-ui/icons/CallToActionTwoTone";
import { DoranHtmlTooltip, DoranPopover, toJalali } from "@doran/react";

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
    }
};

const trans = "posts.list.postColumns";

export default function RenderColumns(props) {
    const { t: translate, onEdit, onDelete, postStatus } = props;

    const columns = [
        {
            key: "id",
            label: translate(`${trans}.id`),
            content: (item, index) => (
                <DoranHtmlTooltip label={<Chip label={<strong>{`0${index + 1}`.slice(-2)}</strong>} />}>
                    <strong style={styles.tooltip}>{translate(`${trans}.idContent`, { id: item.id })}</strong>
                </DoranHtmlTooltip>
            )
        },
        {
            key: "image",
            label: translate(`${trans}.image`),
            content: (item) => (item.file ? <Avatar variant="rounded" src={`${apiUrl}/${item.file.url}`} /> : null)
        },
        { key: "title", path: "title", label: translate(`${trans}.title`), width: "50%" },
        {
            key: "status",
            label: translate(`${trans}.status`),
            content: (item) => postStatus.find((e) => e.value === item.status).label,
            width: "20%"
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
                    </List>
                </DoranPopover>
            ),
            width: "5%"
        },
        {
            key: "operations",
            label: translate(`${trans}.operations`),
            content: (item) => (
                <React.Fragment>
                    <ButtonGroup size="small" aria-describedby={item._id}>
                        <Button variant="contained" color="primary" onClick={() => onEdit(item)}>
                            {translate(`${trans}.edit`)}
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => onDelete(item)}>
                            {translate(`${trans}.delete`)}
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            ),
            width: "20%"
        }
    ];

    return columns;
}
