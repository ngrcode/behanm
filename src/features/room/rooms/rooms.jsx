import React, { Component } from "react";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import { DoranRemoveDialog, ListItem, showToast } from "@doran/react";

// Components
import RoomList from "./list/room-list";
import RoomListHeader from "./header/room-list-header";
import RoomListFilter from "./filter/room-list-filter";
import RoomAdd from "../room-add/room-add";
import RoomEdit from "../room-edit/room-edit";
import { ClassPrograms } from "./class-program";

// Services
import roomService from "../../../core/services/room.service";
import homeClassService from "../../../core/services/home-class.service";

const trans = "rooms.rooms";
const defaultRoom = { title: "", school: null };

class Rooms extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        room: defaultRoom,
        translate: this.props.t,
        selectedSchool: lodash.pick(this.props.location.state, ["id", "title"]),
        selectedHomeClass: null,
        status: [
            new ListItem(0, this.props.t(`${trans}.statuses.unpublished`)),
            new ListItem(1, this.props.t(`${trans}.statuses.published`)),
            new ListItem(2, this.props.t(`${trans}.statuses.draft`))
        ]
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

    toggleCreateDialog = () => {
        const { openCreateDialog, selectedSchool } = this.state;
        const clonedRoom = Object.assign(defaultRoom, { school: selectedSchool });
        this.setState({ openCreateDialog: !openCreateDialog, room: clonedRoom });
    };

    handleCreateRoom = (room) => {
        let { items, total } = this.state;
        items.push(Object.assign(room, { homeClasses: [] }));
        this.setState({ items, total: total + 1 });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = (room) => {
        const { openUpdateDialog } = this.state;
        if (room && room.id) {
            const clonedItem = this.initializeEditRoom(room);
            this.setState({ openUpdateDialog: !openUpdateDialog, room: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, room: defaultRoom });
        }
    };

    handleUpdateRoom = (room) => {
        let { items, total } = this.state;
        const index = items.findIndex((e) => e.id === room.id);
        items.splice(index, 1, Object.assign(room, { homeClasses: [] }));
        this.setState({ items, total });

        this.toggleUpdateDialog();
    };

    initializeEditRoom(room) {
        let clonedItem = lodash.cloneDeep(room);
        return lodash.pick(clonedItem, ["id", "title", "school"]);
    }

    toggleDeleteDialog = (room) => {
        const { openDeleteDialog } = this.state;
        this.setState({ openDeleteDialog: !openDeleteDialog, room: room ? room : defaultRoom });
    };

    handleDeleteRoom = async (room) => {
        await roomService
            .remove(room.id)
            .then(() => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === room.id);
                items.splice(index, 1);

                this.setState({ items, total: total - 1, openDeleteDialog: !openDeleteDialog });

                const success = this.state.translate(`${trans}.deletedSuccessfully`, { title: room.title });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.state.translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    async load() {
        const {
            pageNumber,
            filterCriteria: { title, status },
            selectedSchool
        } = this.state;

        const filter = {
            title: title ? title : null,
            status: status ? status.map((e) => e.value) : null,
            "school.id": selectedSchool.id
        };

        await roomService
            .list({ page: pageNumber, ...filter })
            .then(({ data }) => {
                const items = data["hydra:member"].map((item) => {
                    item.homeClasses = [];
                    return item;
                });

                this.setState({ items, total: data["hydra:totalItems"] });
            })
            .catch((error) => {});
    }

    async loadHomeClass(homeClassId) {
        await homeClassService
            .item(homeClassId)
            .then(({ data }) => this.setState({ selectedHomeClass: data }))
            .catch((error) => {});
    }

    onNodeSelect = (value) => {
        const splitter = value.toString().split(".");
        if (splitter.length < 2) return;

        const homeClassId = +lodash.last(splitter);
        this.loadHomeClass(homeClassId);
    };

    render() {
        const { items, total, pageSize, pageNumber, room, status, selectedSchool, selectedHomeClass } = this.state;
        const { openCreateDialog, openUpdateDialog, openDeleteDialog } = this.state;
        const { t: translate } = this.props;

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <RoomAdd
                        room={room}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreateRoom}
                        school={selectedSchool}
                    />
                )}

                {openUpdateDialog && (
                    <RoomEdit
                        room={room}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdateRoom}
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={room}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteRoom}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <RoomListHeader onDialog={this.toggleCreateDialog} school={selectedSchool} />
                <RoomListFilter onFilterChange={this.handleFilter} status={status} />
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <RoomList
                            items={items}
                            total={total}
                            pageSize={pageSize}
                            pageNumber={pageNumber}
                            onCreate={this.toggleCreateDialog}
                            onEdit={this.toggleUpdateDialog}
                            onDelete={this.toggleDeleteDialog}
                            onPageNumberChange={this.handlePageNumberChange}
                            onNodeSelect={this.onNodeSelect}
                            status={status}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        {selectedHomeClass && <ClassPrograms school={selectedSchool} homeClass={selectedHomeClass} />}
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default withTranslation("room")(Rooms);
