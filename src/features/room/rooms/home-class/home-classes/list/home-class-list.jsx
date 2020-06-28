import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import AddTwoToneIcon from "@material-ui/icons/AddTwoTone";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { DoranTreeViewItem, DoranPagination } from "@doran/react";

const styles = {
    add: {
        textAlign: "center",
    },
    operation: {
        marginTop: "8px",
    },
    pagination: {
        position: "relative",
        bottom: "-4px",
        width: "100%",
    },
};

const trans = "homeClasses.homeClasses.list";

function HomeClassList(props) {
    const { t: translate } = props;
    const { room, items, total, pageSize, pageNumber } = props;
    const { onPageNumberChange, onCreate, onEdit, onDelete } = props;

    const elements = (item, index) => {
        return (
            items &&
            items.map((item, index) => {
                const attributes = {
                    key: index,
                    nodeId: `${room.id}.${item.id}`,
                    labelText: `${item.title} (${item.year})`,
                    labelIcon: FolderOpenIcon,
                    operation: (
                        <div style={styles.operation}>
                            <EditTwoToneIcon color="primary" onClick={() => onEdit(item)} />
                            <DeleteTwoToneIcon color="secondary" onClick={() => onDelete(item)} />
                        </div>
                    ),
                };
                return <DoranTreeViewItem {...attributes} />;
            })
        );
    };

    const create = () => {
        const attributes = {
            style: styles.add,
            key: `room-${room.id}-class-create`,
            nodeId: `room-${room.id}-class-create`,
            labelIcon: AddTwoToneIcon,
            labelText: <span onClick={() => onCreate(room)}>{translate(`${trans}.createHomeClass`)}</span>,
        };

        return <DoranTreeViewItem {...attributes} />;
    };

    const pagination = () => {
        const attributes = {
            totalCount: total,
            pageSizeSelectable: false,
            pageSize: pageSize,
            pageNumber: pageNumber,
            displayedRowsFormatter: ({ from, to, count }) => translate(`${trans}.displayedRowsFormat`, { from, to, count }),
            onChangePageClick: (event, newPage) => onPageNumberChange(newPage),
        };

        return (
            <table style={styles.pagination}>
                <DoranPagination {...attributes} />
            </table>
        );
    };

    return (
        <React.Fragment>
            {elements()}
            {create()}
            {pagination()}
        </React.Fragment>
    );
}

HomeClassList.propTypes = {
    room: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    onPageNumberChange: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default withTranslation("homeClass")(HomeClassList);
