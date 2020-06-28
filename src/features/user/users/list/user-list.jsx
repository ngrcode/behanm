import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { DoranPaginationTable } from "@doran/react";
import renderColumns from "./user-columns";
const trans = "users.list";

class UserList extends Component {
    render() {
        const { t: translate } = this.props;
        const { items, total, pageSize, pageNumber, onPageNumberChange } = this.props;        
        if (total === 0) return null;
        
        const columns = renderColumns(this.props);
        items.forEach(item => item["fullName"] = `${item["firstName"]} ${item["lastName"]}`);

        return (
            <DoranPaginationTable
                columns={columns}
                items= {items}
                total={total}
                pageSize={pageSize}
                pageNumber={pageNumber}
                onPageNumberChange={onPageNumberChange}
                displayedRowsFormatter={({from, to, count}) => translate(`${trans}.displayedRowsFormat`, { from, to, count })}
            />
        );
    }
}

export default withTranslation("user")(UserList);
