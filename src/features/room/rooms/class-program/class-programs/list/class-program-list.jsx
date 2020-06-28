import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { DoranPaginationTable } from "@doran/react";
import renderColumns from "./class-program-columns";

class ClassProgramList extends Component {
    render() {
        const { items, total } = this.props;
        if (total === 0) return null;

        const columns = renderColumns(this.props);
        return <DoranPaginationTable showPagination={false} columns={columns} items={items} />;
    }
}

ClassProgramList.propTypes = {
    items: PropTypes.array.isRequired,
};

export default withTranslation("classProgram")(ClassProgramList);
