import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Paper from "@material-ui/core/Paper";
import TreeView from "@material-ui/lab/TreeView";
import MeetingRoomTwoToneIcon from "@material-ui/icons/MeetingRoomTwoTone";
import AddTwoToneIcon from "@material-ui/icons/AddTwoTone";
import ExpandMoreTwoToneIcon from "@material-ui/icons/ExpandMoreTwoTone";
import ChevronRightTwoToneIcon from "@material-ui/icons/ChevronRightTwoTone";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import { DoranTreeViewItem, DoranPagination } from "@doran/react";
import { HomeClasses } from "../home-class";

const styles = {
    root: {
        marginTop: "24px"
    },
    treeview: {
        flexGrow: 1,
        marginTop: "4px",
        paddingTop: "20px",
        paddingRight: "12px"
    },
    defaultIcon: {
        width: "24px"
    },
    create: {
        textAlign: "center"
    },
    operation: {
        marginTop: "8px"
    },
    pagination: {
        width: "100%",
        position: "relative",
        bottom: "-4px"
    }
};

const trans = "rooms.list";

class RoomList extends Component {
    create = () => {
        const { t: translate, onCreate, total } = this.props;

        const attributes = {
            style: styles.create,
            key: total,
            nodeId: (total + 1).toString(),
            labelIcon: AddTwoToneIcon,
            labelText: <span onClick={onCreate}>{translate(`${trans}.createRoom`)}</span>
        };

        return <DoranTreeViewItem {...attributes} />;
    };

    homeClasses = (room) => {
        const { onHomeClassCreate, onHomeClassEdit, onHomeClassDelete } = this.props;
        const attributes = {
            room,
            onCreate: onHomeClassCreate,
            onEdit: onHomeClassEdit,
            onDelete: onHomeClassDelete
        };

        return room.homeClasses && <HomeClasses {...attributes} />;
    };

    room = (item, index) => {
        const { onEdit, onDelete } = this.props;
        const attributes = {
            key: index,
            nodeId: index.toString(),
            labelText: item.title,
            labelIcon: MeetingRoomTwoToneIcon,
            operation: (
                <div style={styles.operation}>
                    <EditTwoToneIcon
                        color="primary"
                        onClick={(event) => {
                            event.stopPropagation();
                            onEdit(item);
                        }}
                    />
                    <DeleteTwoToneIcon
                        color="secondary"
                        onClick={(event) => {
                            event.stopPropagation();
                            onDelete(item);
                        }}
                    />
                </div>
            )
        };

        return <DoranTreeViewItem {...attributes}>{this.homeClasses(item)}</DoranTreeViewItem>;
    };

    rooms = () => {
        const { items } = this.props;
        return items && items.map((item, index) => this.room(item, index));
    };

    pagination = () => {
        const { t: translate, onPageNumberChange } = this.props;
        const { total, pageSize, pageNumber } = this.props;

        const attributes = {
            totalCount: total,
            pageSizeSelectable: false,
            pageSize: pageSize,
            pageNumber: pageNumber,
            displayedRowsFormatter: ({ from, to, count }) =>
                translate(`${trans}.displayedRowsFormat`, { from, to, count }),
            onChangePageClick: (event, newPage) => onPageNumberChange(newPage)
        };

        return (
            <table style={styles.pagination}>
                <DoranPagination {...attributes} />
            </table>
        );
    };

    render() {
        const { onNodeSelect } = this.props;
        const attributes = {
            style: styles.treeview,
            defaultCollapseIcon: <ExpandMoreTwoToneIcon />,
            defaultExpandIcon: <ChevronRightTwoToneIcon />,
            defaultEndIcon: <div style={styles.defaultIcon} />,
            defaultExpanded: ["-1"],
            onNodeSelect: (event, value) => onNodeSelect(value)
        };

        return (
            <Paper style={styles.root}>
                <TreeView {...attributes}>
                    {this.rooms()}
                    {this.create()}
                    {this.pagination()}
                </TreeView>
            </Paper>
        );
    }
}

RoomList.propTypes = {
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    onPageNumberChange: PropTypes.func.isRequired,
    onNodeSelect: PropTypes.func
};

export default withTranslation("room")(RoomList);
