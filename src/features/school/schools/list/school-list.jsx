import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { DoranPaginationTable } from "@doran/react";
import renderColumns from "./school-columns";

const trans = "schools.list";

class SchoolList extends Component {
    render() {
        const { t: translate } = this.props;
        const { items, total, pageSize, pageNumber } = this.props;
        const { onPageNumberChange, onPageSizeChange } = this.props;
        if (total === 0) return null;

        const columns = renderColumns(this.props);

        return (
            <DoranPaginationTable
                columns={columns}
                items={items}
                total={total}
                pageNumber={pageNumber}
                pageSize={pageSize}
                onPageNumberChange={onPageNumberChange}
                onPageSizeChange={onPageSizeChange}
                displayedRowsFormatter={({ from, to, count }) => translate(`${trans}.displayedRowsFormat`, { from, to, count })}
            />
        );
    }
}

SchoolList.propTypes = {
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    onPageNumberChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func.isRequired
};

export default withTranslation("school")(SchoolList);
