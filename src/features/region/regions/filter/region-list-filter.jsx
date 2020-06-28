import React from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranFilterPanel, DoranForm } from "@doran/react";

const defaultFilter = { name: "", types: [], status: [] };
const trans = "regions.filter.regionListFilter";

class RegionListFilter extends DoranForm {
    state = { data: lodash.cloneDeep(defaultFilter) };

    async componentDidMount() {
        this.handleFilterChange();
    }

    handleFilterChange = (filter) => {
        const { data } = this.state;
        const { onFilterChange } = this.props;
        onFilterChange(filter ? filter : data);
    };

    handleReset = () => {
        const filter = lodash.cloneDeep(defaultFilter);
        this.setState({ data: filter });

        const { onFilterChange } = this.props;
        onFilterChange(filter);
    };

    render() {
        const { regionStatus, regionTypes, t: translate } = this.props;

        return (
            <DoranFilterPanel
                onFilter={this.handleFilterChange}
                onReset={this.handleReset}
                titleText={translate(`${trans}.titleText`)}
                descriptionText={translate(`${trans}.descriptionText`)}
                clearText={translate(`${trans}.clearText`)}
                filterText={translate(`${trans}.filterText`)}
            >
                <Grid item sm={3}>
                    {this.renderInput({ name: "name", label: translate(`${trans}.name`) })}
                </Grid>
                <Grid item xs={3}>
                    {this.renderMultiSelect({ name: "status", label: translate(`${trans}.status`), options: regionStatus })}
                </Grid>
                <Grid item xs={3}>
                    {this.renderMultiSelect({ name: "types", label: translate(`${trans}.types`), options: regionTypes })}
                </Grid>
            </DoranFilterPanel>
        );
    }
}

RegionListFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    regionStatus: PropTypes.array.isRequired,
    regionTypes: PropTypes.array.isRequired,
};

export default withTranslation("region")(RegionListFilter);
