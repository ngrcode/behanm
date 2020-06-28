import React from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import CallToActionTwoToneIcon from "@material-ui/icons/CallToActionTwoTone";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { DoranPopover, DoranHtmlTooltip, toJalali, DoranSplitButton } from "@doran/react";


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

};

const trans = "regions.list.regionColumns";

export default function RenderColumns(props) {
    const { t: translate, onEdit, onDelete, onRedirect } = props;
    const { regionTypes } = props;

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
        { key: "name", label: translate(`${trans}.name`), content: (item) => item.name, width: "20%" },
        { key: "code", label: translate(`${trans}.code`), content: (item) => item.code, width: "10%" },
        { key: "nameLong", label: translate(`${trans}.nameLong`), content: (item) => item.nameLong, width: "25%" },
        {
            key: "parent",
            label: translate(`${trans}.parent`),
            content: (item) => item.parent && item.parent.name,
            width: "15%"
        },
        {
            key: "type",
            label: translate(`${trans}.type`),
            content: (item) => regionTypes.find((e) => e.value === item.type).label,
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
                <div style={styles.buttonGroup}>
                    <ButtonGroup size="small" aria-describedby={item._id}>
                        <Button variant="contained" color="primary" onClick={() => onEdit(item)}>
                            {translate(`${trans}.edit`)}
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => onDelete(item)}>
                            {translate(`${trans}.delete`)}
                        </Button>
                    </ButtonGroup>
                    <DoranSplitButton color="primary" title={translate(`${trans}.operations`)}>
                        <MenuList>
                            <MenuItem
                                key="schools"
                                style={styles.buttonGroupItem}
                                onClick={() => onRedirect(item, `/schools`)}
                            >
                                {translate(`${trans}.schools`)}
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
