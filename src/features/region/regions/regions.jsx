import React, { Component } from "react";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, showToast } from "@doran/react";

// Components
import RegionList from "./list/region-list";
import RegionListHeader from "./header/region-list-header";
import RegionListFilter from "./filter/region-list-filter";
import RegionAdd from "../region-add/region-add";
import RegionEdit from "../region-edit/region-edit";

// Services
import regionService from "../../../core/services/region.service";

const trans = "regions.regions";
const defaultRegion = { name: "", code: "", nameLong: "", type: null, parent: null };

class Regions extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        region: lodash.cloneDeep(defaultRegion),
        translate: this.props.t,
        regionStatus: [
            new ListItem(0, this.props.t(`${trans}.regionStatus.published`)),
            new ListItem(1, this.props.t(`${trans}.regionStatus.unpublished`)),
            new ListItem(2, this.props.t(`${trans}.regionStatus.draft`))
        ],
        regionTypes: [
            new ListItem("country", this.props.t(`${trans}.regionTypes.country`)),
            new ListItem("city", this.props.t(`${trans}.regionTypes.city`)),
            new ListItem("province", this.props.t(`${trans}.regionTypes.province`)),
            new ListItem("howze", this.props.t(`${trans}.regionTypes.howze`))
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
        this.setState({ openCreateDialog: !openCreateDialog, region: defaultRegion });
    };

    handleCreateRegion = (region) => {
        let { items, total } = this.state;
        items.unshift(region);
        this.setState({ items, total: total + 1 });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = (region) => {
        const { openUpdateDialog } = this.state;
        if (region && region.id) {
            const clonedItem = this.initializeEditRegion(region);
            this.setState({ openUpdateDialog: !openUpdateDialog, region: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, region: lodash.clone(defaultRegion) });
        }
    };

    handleUpdateRegion = (region) => {
        let { items, total } = this.state;
        const index = items.findIndex((e) => e.id === region.id);
        items.splice(index, 1, region);
        this.setState({ items, total });

        this.toggleUpdateDialog();
    };

    initializeEditRegion(region) {
        const { regionTypes } = this.state;
        const { id, name, code, nameLong, type, parent } = region;
        const clonedItem = { id, name, code, nameLong };
        clonedItem.type = regionTypes.find((e) => e.value === type);
        clonedItem.parent = !!parent ? new ListItem(parent.id, parent.name) : null;

        return clonedItem;
    }

    toggleDeleteDialog = (region) => {
        const { openDeleteDialog } = this.state;
        if (region) {
            this.setState({ openDeleteDialog: !openDeleteDialog, region: region });
        } else {
            this.setState({ openDeleteDialog: !openDeleteDialog, region: lodash.cloneDeep(defaultRegion) });
        }
    };

    handleDeleteRegion = async (region) => {
        await regionService
            .remove(region.id)
            .then(() => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === region.id);
                items.splice(index, 1);

                this.setState({ items, total: total - 1, openDeleteDialog: !openDeleteDialog });

                const success = this.state.translate(`${trans}.deletedSuccessfully`, { name: region.name });
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
            filterCriteria: { title, status, types }
        } = this.state;

        const query = {
            page,
            title: title ? title : null,
            status: status.map((e) => e.value),
            type: types.map((e) => e.value)
        };
        await regionService
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
    redirect = (data, path) => {
        this.props.history.push(path, {region:data});
   };

    render() {
        const { items, total, pageSize, pageNumber, region, regionStatus, regionTypes } = this.state;
        const { openCreateDialog, openUpdateDialog, openDeleteDialog } = this.state;
        const { t: translate } = this.props;

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <RegionAdd
                        region={region}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreateRegion}
                        regionTypes={regionTypes}
                    />
                )}

                {openUpdateDialog && (
                    <RegionEdit
                        region={region}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdateRegion}
                        regionTypes={regionTypes}
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={region}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteRegion}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <RegionListHeader onDialog={this.toggleCreateDialog} />
                <RegionListFilter
                    onFilterChange={this.handleFilter}
                    regionTypes={regionTypes}
                    regionStatus={regionStatus}
                />
                <RegionList
                    items={items}
                    total={total}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onEdit={this.toggleUpdateDialog}
                    onDelete={this.toggleDeleteDialog}
                    onPageNumberChange={this.handlePageNumberChange}
                    onPageSizeChange={this.handlePageSizeChange}
                    regionTypes={regionTypes}
                    onRedirect={this.redirect}
                />
            </React.Fragment>
        );
    }
}

export default withTranslation("region")(Regions);
