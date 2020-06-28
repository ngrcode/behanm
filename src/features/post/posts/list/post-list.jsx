import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { DoranPaginationTable } from "@doran/react";
import renderColumns from "./post-columns";

const trans = "posts.list";

class PostList extends Component {
    render() {
        const { t: translate } = this.props;
        const { items, total, pageSize, pageNumber, onPageNumberChange } = this.props;
        if (total === 0) return null;
        const columns = renderColumns(this.props);
        return (
            <DoranPaginationTable
                columns={columns}
                items={items}
                total={total}
                pageSize={pageSize}
                pageNumber={pageNumber}
                onPageNumberChange={onPageNumberChange}
                displayedRowsFormatter={({ from, to, count }) => translate(`${trans}.displayedRowsFormat`, { from, to, count })}
            />
        );
    }
}

PostList.propTypes = {
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    onPageNumberChange: PropTypes.func.isRequired,
    postStatus: PropTypes.array.isRequired,
};

export default withTranslation("post")(PostList);
