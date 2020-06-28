import React, { Component } from "react";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, showToast } from "@doran/react";

// Components
import CategoryList from "./list/category-list";
import CategoryListHeader from "./header/category-list-header";
import CategoryListFilter from "./filter/category-list-filter";
import CategoryAdd from "../category-add/category-add";
import CategoryEdit from "../category-edit/category-edit";

// Services
import categoryService from "../../../core/services/category.service";

const trans = "categories.categories";
const defaultCategory = { title: "", body: "", type: null, parent: null };

class Categories extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        category: lodash.cloneDeep(defaultCategory),
        translate: this.props.t,
        categoryStatus: [
            new ListItem(0, this.props.t(`${trans}.categoryStatus.published`)),
            new ListItem(1, this.props.t(`${trans}.categoryStatus.unpublished`)),
            new ListItem(2, this.props.t(`${trans}.categoryStatus.draft`))
        ],
        categoryTypes: [
            new ListItem("post", this.props.t(`${trans}.categoryTypes.post`)),
            new ListItem("school", this.props.t(`${trans}.categoryTypes.school`)),
            new ListItem("banner", this.props.t(`${trans}.categoryTypes.banner`)),
            new ListItem("position", this.props.t(`${trans}.categoryTypes.position`)),
            new ListItem("post_position", this.props.t(`${trans}.categoryTypes.postPosition`)),
            new ListItem("post_global", this.props.t(`${trans}.categoryTypes.postGlobal`)),
            new ListItem("post_content", this.props.t(`${trans}.categoryTypes.postContent`)),
            new ListItem("post_subject", this.props.t(`${trans}.categoryTypes.postSubject`)),
            new ListItem("post_pub", this.props.t(`${trans}.categoryTypes.postPub`))
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
        this.setState({ openCreateDialog: !openCreateDialog, category: lodash.cloneDeep(defaultCategory) });
    };

    handleCreateCategory = (category) => {
        let { items, total } = this.state;
        items.unshift(category);
        this.setState({ items, total: total + 1 });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = (category) => {
        const { openUpdateDialog } = this.state;
        if (category && category.id) {
            const clonedItem = this.initializeEditCategory(category);
            this.setState({ openUpdateDialog: !openUpdateDialog, category: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, category: lodash.cloneDeep(defaultCategory) });
        }
    };

    handleUpdateCategory = (category) => {
        let { items, total } = this.state;
        const index = items.findIndex((e) => e.id === category.id);
        items.splice(index, 1, category);
        this.setState({ items, total });

        this.toggleUpdateDialog();
    };

    initializeEditCategory(category) {
        const { categoryTypes } = this.state;
        const { id, title, body, type, parent } = category;
        const clonedItem = { id, title, body };
        clonedItem.type = categoryTypes.find((e) => e.value === type);
        clonedItem.parent = !!parent ? new ListItem(parent.id, parent.title) : null;

        return clonedItem;
    }

    toggleDeleteDialog = (category) => {
        const { openDeleteDialog } = this.state;
        if (category) {
            this.setState({ openDeleteDialog: !openDeleteDialog, category: category });
        } else {
            this.setState({ openDeleteDialog: !openDeleteDialog, category: lodash.cloneDeep(defaultCategory) });
        }
    };

    handleDeleteCategory = async (category) => {
        await categoryService
            .remove(category.id)
            .then(() => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === category.id);
                items.splice(index, 1);

                this.setState({ items, total: total - 1, openDeleteDialog: !openDeleteDialog });

                const message = this.props.t(`${trans}.deletedSuccessfully`, { title: category.title });
                showToast({ variant: "success", message });
            })
            .catch(() => {
                const message = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message });
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
        await categoryService
            .list(query)
            .then(async ({ data }) => {
                const items = data["hydra:member"];
                const total = data["hydra:totalItems"];

                this.setState({ items, total });
            })
            .catch((error) => {});
    }

    render() {
        const { items, total, pageSize, pageNumber, category, categoryStatus, categoryTypes } = this.state;
        const { openCreateDialog, openUpdateDialog, openDeleteDialog, translate } = this.state;

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <CategoryAdd
                        category={category}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreateCategory}
                        categoryTypes={categoryTypes}
                    />
                )}

                {openUpdateDialog && (
                    <CategoryEdit
                        category={category}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdateCategory}
                        categoryTypes={categoryTypes}
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={category}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteCategory}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <CategoryListHeader onDialog={this.toggleCreateDialog} />
                <CategoryListFilter
                    onFilterChange={this.handleFilter}
                    categoryStatus={categoryStatus}
                    categoryTypes={categoryTypes}
                />
                <CategoryList
                    items={items}
                    total={total}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onEdit={this.toggleUpdateDialog}
                    onDelete={this.toggleDeleteDialog}
                    onPageNumberChange={this.handlePageNumberChange}
                    onPageSizeChange={this.handlePageSizeChange}
                    categoryTypes={categoryTypes}
                />
            </React.Fragment>
        );
    }
}

export default withTranslation("category")(Categories);
