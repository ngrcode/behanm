import React from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranFilterPanel, DoranForm } from "@doran/react";

const defaultFilter = { name: "" };
const trans = "educationComplexes.filter.educationComplexListFilter";

class EducationComplexListFilter extends DoranForm {
    state = {
        data: lodash.cloneDeep(defaultFilter)
    };

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
        const { t: translate } = this.props;

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
            </DoranFilterPanel>
        );
    }
}

EducationComplexListFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired
};

export default withTranslation("educationComplex")(EducationComplexListFilter);
