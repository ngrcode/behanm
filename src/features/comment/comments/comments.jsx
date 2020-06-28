import React, { Component } from "react";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, showToast } from "@doran/react";

// Components
import CommentList from "./list/comment-list";
import CommentListHeader from "./header/comment-list-header";
import CommentListFilter from "./filter/comment-list-filter";
// import BannerEdit from "../comment-edit/comment-edit";

// Services
import commentService from "../../../core/services/comment.service";

// Configs

const trans = "comments.comments";
const defaultComment = { title: "", body: "", posts: [] };

class Comments extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        comment: lodash.cloneDeep(defaultComment),
        defaultStatus: "",
        commentStatus: [
            new ListItem(1, this.props.t(`${trans}.commentStatus.published`)),
            new ListItem(0, this.props.t(`${trans}.commentStatus.unpublished`))
            // new ListItem(2, this.props.t(`${trans}.commentStatus.draft`)),
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

    handleUpdateComment = async (comment) => {
        const { id, status } = comment;
        await commentService
            .save({ id, status: +!status })
            .then(({ data }) => {
                let { items } = this.state;
                const index = items.findIndex((e) => e.id === id);
                items.splice(index, 1, data);
                this.setState({ items });
            })
            .catch((error) => {});
    };

    handleDeleteComment = async (comment) => {
        await commentService
            .remove(comment.id)
            .then(() => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === comment.id);
                items.splice(index, 1);

                this.setState({ items, total: total - 1, openDeleteDialog: !openDeleteDialog });

                const success = this.props.t(`${trans}.deletedSuccessfully`, { title: comment.title });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    toggleDeleteDialog = (comment) => {
        const { openDeleteDialog } = this.state;
        if (comment) {
            this.setState({ openDeleteDialog: !openDeleteDialog, comment: comment });
        } else {
            this.setState({ openDeleteDialog: !openDeleteDialog, comment: lodash.cloneDeep(defaultComment) });
        }
    };

    async load() {
        const {
            pageNumber: page,
            filterCriteria: { title, body, postName, status }
        } = this.state;

        const query = {
            page,
            title: title ? title : null,
            body: body ? body : null,
            "post.title": postName ? postName : null,
            status: status.map((e) => e.value)
        };
        await commentService
            .list(query)
            .then(({ data }) => {
                this.setState({ items: data["hydra:member"], total: data["hydra:totalItems"] });
            })
            .catch((error) => {});
    }

    render() {
        const { items, total, pageSize, pageNumber, comment, commentStatus } = this.state;
        const { openDeleteDialog } = this.state;
        const { t: translate } = this.props;

        return (
            <React.Fragment>
                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={comment}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteComment}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <CommentListHeader onDialog={this.toggleCreateDialog} />
                <CommentListFilter onFilterChange={this.handleFilter} status={commentStatus} />
                <CommentList
                    items={items}
                    total={total}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onDelete={this.toggleDeleteDialog}
                    onChecked={this.handleUpdateComment}
                    onPageNumberChange={this.handlePageNumberChange}
                    onPageSizeChange={this.handlePageSizeChange}
                />
            </React.Fragment>
        );
    }
}

export default withTranslation("comment")(Comments);
