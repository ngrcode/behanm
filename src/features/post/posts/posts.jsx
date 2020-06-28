import React, { Component } from "react";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, urlToBase64Post, showToast } from "@doran/react";

// Components
import PostList from "./list/post-list";
import PostListHeader from "./header/post-list-header";
import PostListFilter from "./filter/post-list-filter";
import PostAdd from "../post-add/post-add";
import PostEdit from "../post-edit/post-edit";

// Services
import postService from "../../../core/services/post.service";

// Configs
import { apiUrl } from "../../../config.json";

const trans = "posts.posts";
const defaultPost = { title: "", body: "", school: null, image: null, categories: [] };

class Posts extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        post: lodash.cloneDeep(defaultPost),
        postStatus: [
            new ListItem(0, this.props.t(`${trans}.postStatus.published`)),
            new ListItem(1, this.props.t(`${trans}.postStatus.unpublished`)),
            new ListItem(2, this.props.t(`${trans}.postStatus.draft`))
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
        this.setState({ openCreateDialog: !openCreateDialog, post: lodash.cloneDeep(defaultPost) });
    };

    handleCreatePost = (post) => {
        let { items, total } = this.state;
        items.unshift(post);
        this.setState({ items, total: total + 1 });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = async (post) => {
        const { openUpdateDialog } = this.state;
        if (post && post.id) {
            const clonedItem = await this.initializeEditPost(post);
            this.setState({ openUpdateDialog: !openUpdateDialog, post: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, post: lodash.cloneDeep(defaultPost) });
        }
    };

    handleUpdatePost = (post) => {
        let { items, total } = this.state;
        const index = items.findIndex((e) => e.id === post.id);
        items.splice(index, 1, post);
        this.setState({ items, total });

        this.toggleUpdateDialog();
    };

    initializeEditPost = async (post) => {
        const { id, title, body, file, school, categories } = post;
        const clonedItem = { id, title, body };
        clonedItem.image = !!file
            ? await urlToBase64Post(`${apiUrl}/api/files/images`, {
                  image: file.url.slice(7, file.url.length)
              })
            : null;
        clonedItem.school = !!school ? new ListItem(school.id, school.title) : null;
        clonedItem.categories = categories.map((e) => new ListItem(e.id, e.title));

        return clonedItem;
    };

    toggleDeleteDialog = (post) => {
        const { openDeleteDialog } = this.state;
        if (post) {
            this.setState({ openDeleteDialog: !openDeleteDialog, post: post });
        } else {
            this.setState({ openDeleteDialog: !openDeleteDialog, post: lodash.cloneDeep(defaultPost) });
        }
    };

    handleDeletePost = async (post) => {
        await postService
            .remove(post.id)
            .then(() => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === post.id);
                items.splice(index, 1);

                this.setState({ items, total: total - 1, openDeleteDialog: !openDeleteDialog });

                const message = this.props.t(`${trans}.deletedSuccessfully`, { title: post.title });
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
            filterCriteria: { title, categoryTitle, schoolTitle, status: statusArray }
        } = this.state;

        const status = statusArray.map((e) => e.value);
        const query = {
            page,
            status,
            title: title ? title : null,
            "category.title": categoryTitle ? categoryTitle : null,
            "school.title": schoolTitle ? schoolTitle : null
        };
        await postService
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

    render() {
        const { items, total, pageSize, pageNumber, post, postStatus } = this.state;
        const { openCreateDialog, openUpdateDialog, openDeleteDialog } = this.state;
        const { t: translate } = this.props;
        return (
            <React.Fragment>
                {openCreateDialog && (
                    <PostAdd
                        post={post}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreatePost}
                    />
                )}
                {openUpdateDialog && (
                    <PostEdit
                        post={post}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdatePost}
                    />
                )}
                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={post}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeletePost}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}
                <PostListHeader onDialog={this.toggleCreateDialog} />
                <PostListFilter onFilterChange={this.handleFilter} postStatus={postStatus} />
                <PostList
                    items={items}
                    total={total}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onEdit={this.toggleUpdateDialog}
                    onDelete={this.toggleDeleteDialog}
                    onPageNumberChange={this.handlePageNumberChange}
                    onPageSizeChange={this.handlePageSizeChange}
                    postStatus={postStatus}
                />
            </React.Fragment>
        );
    }
}

export default withTranslation("post")(Posts);
