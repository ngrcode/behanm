import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { DoranPaginationTable } from "@doran/react";
import renderColumns from "./region-columns";

const trans = "regions.list";

class RegionList extends Component {
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
                pageSize={pageSize}
                pageNumber={pageNumber}
                onPageNumberChange={onPageNumberChange}
                onPageSizeChange={onPageSizeChange}
                displayedRowsFormatter={({ from, to, count }) => translate(`${trans}.displayedRowsFormat`, { from, to, count })}
            />
        );
    }
}

export default withTranslation("region")(RegionList);
