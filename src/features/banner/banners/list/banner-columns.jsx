import React from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import CallToActionTwoToneIcon from "@material-ui/icons/CallToActionTwoTone";
import { DoranPopover, DoranHtmlTooltip, toJalali } from "@doran/react";

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

const trans = "banners.list.bannerColumns";

export default function RenderColumns(props) {
    const { t: translate, onEdit, onDelete } = props;

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
        { key: "title", path: "title", label: translate(`${trans}.title`), width: "70%" },
        {
            key: "status",
            label: translate(`${trans}.status`),
            content: (item) => (
                <React.Fragment>
                    {item.status === 0
                        ? translate(`${trans}.bannerStatus.published`)
                        : item.status === 1
                        ? translate(`${trans}.bannerStatus.unpublished`)
                        : translate(`${trans}.bannerStatus.draft`)}
                </React.Fragment>
            ),
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
            width: "10%"
        }
    ];

    return columns;
}
