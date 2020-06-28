import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";

const styles = {
    root: {
        minHeight: "80px"
    },
    listItem: {
        border: "1px solid red",
        borderRadius: "3px",
        marginBottom: "2px"
    },
    iconButton: {
        padding: "4px"
    }
};

const trans = "classPrograms.list.classProgramColumns";

export default function RenderColumns(props) {
    const { t: translate, onDelete, onEdit, showSecondThreeColumns } = props;

    const renderItem = (classProgram, index) => {
        return (
            <ListItem key={index} style={styles.listItem}>
                <ListItemText
                    primary={classProgram.title}
                    secondary={classProgram.lesson ? classProgram.lesson.title : ""}
                />
                <ListItemSecondaryAction>
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        style={styles.iconButton}
                        onClick={() => onEdit(classProgram)}
                    >
                        <EditTwoToneIcon color="primary" />
                    </IconButton>
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        style={styles.iconButton}
                        onClick={() => onDelete(classProgram)}
                    >
                        <DeleteTwoToneIcon color="secondary" />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    };

    const render = (breakItems) => {
        return (
            <div style={styles.root}>
                <List dense={true}>
                    {breakItems && breakItems.map((classProgram, index) => renderItem(classProgram, index))}
                </List>
            </div>
        );
    };

    let breaks = showSecondThreeColumns
        ? ["weekDays", "fourthBreak", "fifthBreak", "sixthBreak"]
        : ["weekDays", "firstBreak", "secondBreak", "thirdBreak"];

    const columns = breaks.map((breakItem, index) => {
        return {
            key: breakItem,
            label: translate(`${trans}.breaks.${breakItem}`),
            content: (item) => {
                if (index === 0) return translate(`${trans}.days.${item.day}`);

                const i = showSecondThreeColumns ? index + 2 : index - 1;
                return render(item.breaks[i]);
            },
            width: `${index === 0 ? 10 : 30}%`
        };
    });

    return columns;
}
