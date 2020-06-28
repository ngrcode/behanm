import React, { Component } from "react";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, urlToBase64Post, showToast } from "@doran/react";

// Components
import BannerList from "./list/banner-list";
import BannerListHeader from "./header/banner-list-header";
import BannerListFilter from "./filter/banner-list-filter";
import BannerAdd from "../banner-add/banner-add";
import BannerEdit from "../banner-edit/banner-edit";

// Services
import bannerService from "../../../core/services/banner.service";

// Configs
import { apiUrl } from "../../../config.json";

const trans = "banners.banners";
const defaultBanner = { title: "", targetLink: "", categories: [], file: null };

class Banners extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        banner: lodash.cloneDeep(defaultBanner),
        bannerStatus: [
            new ListItem(0, this.props.t(`${trans}.bannerStatus.published`)),
            new ListItem(1, this.props.t(`${trans}.bannerStatus.unpublished`)),
            new ListItem(2, this.props.t(`${trans}.bannerStatus.draft`))
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
        this.setState({ openCreateDialog: !openCreateDialog, banner: lodash.cloneDeep(defaultBanner) });
    };

    handleCreateBanner = (banner) => {
        let { items, total } = this.state;
        items.unshift(banner);
        this.setState({ items, total: total + 1 });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = async (banner) => {
        const { openUpdateDialog } = this.state;
        if (banner && banner.id) {
            const { id, title, targetLink, categories, file } = banner;
            const clonedItem = { id, title, targetLink };
            clonedItem.categories = categories.map((e) => new ListItem(e.id, e.title));
            clonedItem.file = await urlToBase64Post(`${apiUrl}/api/files/images`, {
                image: file.url.slice(7, file.url.length)
            });
            this.setState({ openUpdateDialog: !openUpdateDialog, banner: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, banner: lodash.cloneDeep(defaultBanner) });
        }
    };

    handleUpdateBanner = (banner) => {
        let { items, total } = this.state;
        const index = items.findIndex((e) => e.id === banner.id);
        items.splice(index, 1, banner);
        this.setState({ items, total });

        this.toggleUpdateDialog();
    };

    toggleDeleteDialog = (banner) => {
        const { openDeleteDialog } = this.state;
        if (banner) {
            this.setState({ openDeleteDialog: !openDeleteDialog, banner: banner });
        } else {
            this.setState({ openDeleteDialog: !openDeleteDialog, banner: lodash.cloneDeep(defaultBanner) });
        }
    };

    handleDeleteBanner = async (banner) => {
        await bannerService
            .remove(banner.id)
            .then(() => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === banner.id);
                items.splice(index, 1);

                this.setState({ items, total: total - 1, openDeleteDialog: !openDeleteDialog });

                const success = this.props.t(`${trans}.deletedSuccessfully`, { title: banner.title });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    async load() {
        const {
            pageNumber: page,
            filterCriteria: { title, categoryTitle, status }
        } = this.state;

        const query = {
            page,
            title: title ? title : null,
            "category.title": categoryTitle ? categoryTitle : null,
            status: status.map((e) => e.value)
        };
        await bannerService
            .list(query)
            .then(({ data }) => {
                this.setState({ items: data["hydra:member"], total: data["hydra:totalItems"] });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const { items, total, pageSize, pageNumber, banner, bannerStatus } = this.state;
        const { openCreateDialog, openUpdateDialog, openDeleteDialog } = this.state;
        const { t: translate } = this.props;

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <BannerAdd
                        banner={banner}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreateBanner}
                    />
                )}
                {openUpdateDialog && (
                    <BannerEdit
                        banner={banner}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdateBanner}
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={banner}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteBanner}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <BannerListHeader onDialog={this.toggleCreateDialog} />
                <BannerListFilter onFilterChange={this.handleFilter} status={bannerStatus} />
                <BannerList
                    items={items}
                    total={total}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onEdit={this.toggleUpdateDialog}
                    onDelete={this.toggleDeleteDialog}
                    onPageNumberChange={this.handlePageNumberChange}
                    onPageSizeChange={this.handlePageSizeChange}
                />
            </React.Fragment>
        );
    }
}

export default withTranslation("banner")(Banners);
