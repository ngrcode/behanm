import React, { Component } from "react";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, showToast } from "@doran/react";

// Components
import MosqueList from "./list/mosque-list";
import MosqueListHeader from "./header/mosque-list-header";
import MosqueListFilter from "./filter/mosque-list-filter";
import MosqueAdd from "../mosque-add/mosque-add";
import MosqueEdit from "../mosque-edit/mosque-edit";

// Services
import mosqueService from "../../../core/services/mosque.service";

const trans = "mosques.mosques";
const defaultMosque = { title: "", code: "", imamName: "", region: null, howze: null, contacts: [], coordinates: [] };

class Mosques extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        mosque: lodash.cloneDeep(defaultMosque),
        translate: this.props.t,
        mosqueStatus: [
            new ListItem(0, this.props.t(`${trans}.status.published`)),
            new ListItem(1, this.props.t(`${trans}.status.unpublished`)),
            new ListItem(2, this.props.t(`${trans}.status.draft`))
        ],
        contactTypes: [
            new ListItem(0, this.props.t(`${trans}.contactTypes.phone`)),
            new ListItem(1, this.props.t(`${trans}.contactTypes.mobile`)),
            new ListItem(2, this.props.t(`${trans}.contactTypes.email`)),
            new ListItem(3, this.props.t(`${trans}.contactTypes.address`)),
            new ListItem(4, this.props.t(`${trans}.contactTypes.website`)),
            new ListItem(5, this.props.t(`${trans}.contactTypes.fax`))
        ]
    };

    async componentDidUpdate(_, prevState) {
        if (
            prevState.pageNumber === this.state.pageNumber &&
            prevState.pageSize === this.state.pageSize &&
            prevState.filterCriteria === this.state.filterCriteria
        )
            return;

        await this.load();
    }

    handlePageNumberChange = (pageNumber) => {
        this.setState({ pageNumber: pageNumber + 1 });
    };

    handlePageSizeChange = (pageSize) => {
        this.setState({ pageSize, pageNumber: 1 });
    };

    handleFilter = (filterCriteria) => {
        this.setState({ filterCriteria, pageNumber: 1 });
    };

    toggleCreateDialog = () => {
        const { openCreateDialog } = this.state;
        this.setState({ openCreateDialog: !openCreateDialog, mosque: lodash.cloneDeep(defaultMosque) });
    };

    handleCreateMosque = (mosque) => {
        let { items, total } = this.state;
        items.unshift(mosque);
        this.setState({ items, total: total + 1 });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = (mosque) => {
        const { openUpdateDialog } = this.state;
        if (mosque && mosque.id) {
            const clonedItem = this.initializeEditMosque(mosque);
            this.setState({ openUpdateDialog: !openUpdateDialog, mosque: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, mosque: lodash.cloneDeep(defaultMosque) });
        }
    };

    handleUpdateMosque = (mosque) => {
        let { items, total } = this.state;
        const index = items.findIndex((e) => e.id === mosque.id);
        items.splice(index, 1, mosque);
        this.setState({ items, total });

        this.toggleUpdateDialog();
    };

    initializeEditMosque(mosque) {
        const { contactTypes } = this.state;
        const { id, title, code, imamName, region, howze, person, contact, coordinate } = mosque;
        const clonedItem = { id, title, code, imamName, coordinates: coordinate };
        clonedItem.region = new ListItem(region.id, region.name, region.code);
        clonedItem.howze = new ListItem(howze.id, howze.name, howze.code);
        clonedItem.person = new ListItem(person.id, `${person.firstName} ${person.lastName}`);
        clonedItem.contacts = contact.map((e) => {
            return { type: contactTypes.find((i) => e.type === i.value), value: e.value };
        });
        clonedItem.coordinates = coordinate.map((e) => {
            return { lat: +e.lat, lng: +e.lng };
        });

        return clonedItem;
    }

    toggleDeleteDialog = (mosque) => {
        const { openDeleteDialog } = this.state;
        if (mosque) {
            this.setState({ openDeleteDialog: !openDeleteDialog, mosque: mosque });
        } else {
            this.setState({ openDeleteDialog: !openDeleteDialog, mosque: lodash.cloneDeep(defaultMosque) });
        }
    };

    handleDeleteMosque = async (mosque) => {
        await mosqueService
            .remove(mosque.id)
            .then(() => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === mosque.id);
                items.splice(index, 1);

                this.setState({ items, total: total - 1, openDeleteDialog: !openDeleteDialog });

                const success = this.state.translate(`${trans}.deletedSuccessfully`, { title: mosque.title });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.state.translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    async load() {
        const {
            pageNumber: page,
            filterCriteria: { title, regionName, regionCode, howzeName, status: statusArray }
        } = this.state;

        const status = statusArray.map((e) => e.value);
        const query = {
            page,
            status,
            title: title ? title : null,
            "region.name": regionName ? regionName : null,
            "region.code": regionCode ? regionCode : null,
            "howze.name": howzeName ? howzeName : null
        };
        await mosqueService
            .list(query)
            .then(({ data }) => {
                const items = data["hydra:member"];
                const total = data["hydra:totalItems"];

                this.setState({ items, total });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    redirect = (schools,path) =>{
        this.props.history.push(path, {mosque:schools} )
    }

    render() {
        const { items, total, pageSize, pageNumber, mosque, mosqueStatus, contactTypes } = this.state;
        const { openCreateDialog, openUpdateDialog, openDeleteDialog } = this.state;
        const { t: translate } = this.props;

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <MosqueAdd
                        mosque={mosque}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreateMosque}
                        contactTypes={contactTypes}
                    />
                )}

                {openUpdateDialog && (
                    <MosqueEdit
                        mosque={mosque}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdateMosque}
                        contactTypes={contactTypes}
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={mosque}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteMosque}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <MosqueListHeader onDialog={this.toggleCreateDialog} />
                <MosqueListFilter onFilterChange={this.handleFilter} mosqueStatus={mosqueStatus} />
                <MosqueList
                    items={items}
                    total={total}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onEdit={this.toggleUpdateDialog}
                    onDelete={this.toggleDeleteDialog}
                    onPageNumberChange={this.handlePageNumberChange}
                    onPageSizeChange={this.handlePageSizeChange}
                    onRedirect={this.redirect}
                />
            </React.Fragment>
        );
    }
}

export default withTranslation("mosque")(Mosques);
