import React from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import CallToActionTwoToneIcon from "@material-ui/icons/CallToActionTwoTone";
import MoreIcon from "@material-ui/icons/More";
import Typography from "@material-ui/core/Typography";
import { DoranCheckbox, DoranPopover, DoranHtmlTooltip, toJalali } from "@doran/react";

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
    pop: {
        backgrondColor: "red",
        margin: 100
    },
    icon: {
        fontSize: 18,
        color: "green",
        marginTop: 4
    },
    body: {
        margin: 20,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        maxWidth: 500,
        wordBreak: "break-word",
        textAlign: "justify",
        fontSize: "0.9rem"
    },
    nowrap: {
        whiteSpace: "nowrap"
    }
};

const trans = "comments.list.commentColumns";

export default function RenderColumns(props) {
    const { t: translate, onDelete, onChecked } = props;

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
        { key: "title", path: "title", label: translate(`${trans}.title`), width: "35%" },
        {
            key: "body",
            label: translate(`${trans}.body`),
            content: (item) => (
                <React.Fragment>
                    <div style={styles.nowrap}>
                        <DoranPopover Icon={MoreIcon} iconStyle={styles.info}>
                            <Typography variant={null} paragraph={true} aria-haspopup="true" style={styles.body}>
                                {item.body}
                            </Typography>
                        </DoranPopover>
                    </div>
                </React.Fragment>
            ),
            width: "20%"
        },
        { key: "post", label: translate(`${trans}.post`), content: (item) => item.post.title, width: "15%" },
        {
            key: "status",
            label: translate(`${trans}.status`),
            content: (item) => (
                <React.Fragment>
                    <div style={styles.nowrap}>
                        <DoranCheckbox value={!!item.status} onChange={() => onChecked(item)} />

                        {item.status === 1
                            ? translate(`${trans}.commentStatus.published`)
                            : translate(`${trans}.commentStatus.unpublished`)}
                    </div>
                </React.Fragment>
            ),
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
                    <Button variant="contained" color="secondary" onClick={() => onDelete(item)}>
                        {translate(`${trans}.delete`)}
                    </Button>
                </React.Fragment>
            ),
            width: "10%"
        }
    ];

    return columns;
}
