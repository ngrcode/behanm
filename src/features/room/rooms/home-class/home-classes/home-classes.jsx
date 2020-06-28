import React, { Component } from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, showToast } from "@doran/react";
import { HomeClassList } from "./list";
import { HomeClassListFilter } from "./filter";
import { HomeClassAdd } from "../home-class-add";
import { HomeClassEdit } from "../home-class-edit";

// Services
import homeClassService from "../../../../../core/services/home-class.service";

const styles = {
    root: {
        border: "1px solid #ff00007a",
        borderRadius: "4px"
    }
};

const defaultHomeClass = { title: "", year: "", room: null };
const trans = "homeClasses.homeClasses";

class HomeClasses extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        translate: this.props.t,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        homeClass: defaultHomeClass
    };

    async componentDidUpdate(_, prevState) {
        if (prevState.pageNumber === this.state.pageNumber && prevState.filterCriteria === this.state.filterCriteria)
            return;

        await this.load();
    }

    handlePageNumberChange = (pageNumber) => {
        this.setState({ pageNumber: pageNumber + 1 });
    };

    handleFilter = (filterCriteria) => {
        this.setState({ filterCriteria, pageNumber: 1 });
    };

    toggleCreateDialog = (room) => {
        const { openCreateDialog } = this.state;
        const clonedHomeClass = Object.assign(defaultHomeClass, { room: room });
        this.setState({ openCreateDialog: !openCreateDialog, homeClass: clonedHomeClass });
    };

    handleHomeClassCreate = (homeClass) => {
        let { items } = this.state;
        items.push(homeClass);
        this.setState({ items });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = (homeClass) => {
        const { openUpdateDialog } = this.state;
        if (homeClass && homeClass.id) {
            const clonedItem = this.initializeEdit(homeClass);
            this.setState({ openUpdateDialog: !openUpdateDialog, homeClass: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, homeClass: defaultHomeClass });
        }
    };

    handleUpdate = (homeClass) => {
        let { items } = this.state;
        const index = items.findIndex((e) => e.id === homeClass.id);
        items.splice(index, 1, homeClass);
        this.setState({ items });

        this.toggleUpdateDialog();
    };

    initializeEdit(homeClass) {
        let clonedItem = lodash.cloneDeep(homeClass);
        return lodash.pick(clonedItem, ["id", "title", "year", "room"]);
    }

    toggleDeleteDialog = (homeClass) => {
        const { openDeleteDialog } = this.state;
        if (homeClass) {
            this.setState({ openDeleteDialog: !openDeleteDialog, homeClass: homeClass });
        } else {
            this.setState({ openDeleteDialog: !openDeleteDialog, homeClass: defaultHomeClass });
        }
    };

    handleDelete = async (homeClass) => {
        await homeClassService
            .remove(homeClass.id)
            .then(() => {
                const { items, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === homeClass.id);
                items.splice(index, 1);

                this.setState({ items, openDeleteDialog: !openDeleteDialog });

                const success = this.state.translate(`${trans}.deletedSuccessfully`, { title: homeClass.title });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.state.translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    load = async () => {
        const { room } = this.props;
        const {
            pageNumber,
            filterCriteria: { title, year }
        } = this.state;

        const filter = {
            title: title ? title : null,
            year: year ? year : null,
            "room.id": room.id
        };

        await homeClassService
            .list({ page: pageNumber, ...filter })
            .then(({ data }) => {
                this.setState({ items: data["hydra:member"], total: data["hydra:totalItems"] });
            })
            .catch((error) => {});
    };

    render() {
        const { t: translate, room } = this.props;
        const { items, total, pageSize, pageNumber, homeClass, selectedRoom } = this.state;
        const { openCreateDialog, openUpdateDialog, openDeleteDialog } = this.state;

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <HomeClassAdd
                        homeClass={homeClass}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleHomeClassCreate}
                        room={selectedRoom}
                    />
                )}

                {openUpdateDialog && (
                    <HomeClassEdit
                        homeClass={homeClass}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdate}
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={homeClass}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDelete}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <div style={styles.root}>
                    <HomeClassListFilter onFilterChange={this.handleFilter} />
                    <HomeClassList
                        room={room}
                        items={items}
                        total={total}
                        pageSize={pageSize}
                        pageNumber={pageNumber}
                        onPageNumberChange={this.handlePageNumberChange}
                        onCreate={this.toggleCreateDialog}
                        onEdit={this.toggleUpdateDialog}
                        onDelete={this.toggleDeleteDialog}
                    />
                </div>
            </React.Fragment>
        );
    }
}

HomeClasses.propTypes = {
    room: PropTypes.object.isRequired
};

export default withTranslation("homeClass")(HomeClasses);
