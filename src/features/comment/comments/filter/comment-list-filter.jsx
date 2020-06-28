import React from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranFilterPanel } from "@doran/react";

const defaultFilter = { title: "", categoryTitle: "", status: [] };
const trans = "comments.filter.commentListFilter";

class BannerListFilter extends DoranForm {
    state = { data: lodash.cloneDeep(defaultFilter) };

    async componentDidMount() {
        this.handleFilterChange();
    }

    handleFilterChange = filter => {
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
        const { t: translate, status } = this.props;

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
                    {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                </Grid>
                <Grid item xs={3}>
                    {this.renderMultiSelect({ name: "status", label: translate(`${trans}.status`), options: status })}
                </Grid>
            </DoranFilterPanel>
        );
    }
}

BannerListFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired
};

export default withTranslation("comment")(BannerListFilter);
