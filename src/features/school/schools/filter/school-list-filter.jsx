import React from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { ListItem, DoranFilterPanel, DoranForm } from "@doran/react";
// services
import educationComplexService from "../../../../core/services/education-complex.service"
import mosqueService from "../../../../core/services/mosque.service"

const defaultFilter = { title: "", gender: null, regionName: "", howzeName: "", status: [], educationComplex: null, mosque: null };
const trans = "schools.filter.schoolListFilter";

class SchoolListFilter extends DoranForm {
    state = { data: this.defaultFilter() };

    defaultFilter() {
        const filter = lodash.cloneDeep(defaultFilter);
        if (this.props.region) {
            filter.regionName = this.props.region;
        } else if (this.props.educationComplex) {
            filter.educationComplex = this.props.educationComplex;
        } else if (this.props.mosque) {
            filter.mosque = this.props.mosque;
        }
        return filter;
    }

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

    listItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id,  e.name ));
    };
    mosqueListItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id,  e.title ));
    };

    render() {
        const { t: translate, schoolStatus, schoolGenders } = this.props;

        return (
            <DoranFilterPanel
                expanded
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
                <Grid item sm={3}>
                    {this.renderInput({ name: "regionName", label: translate(`${trans}.regionName`) })}
                </Grid>
                <Grid item sm={3}>
                        {this.renderAutocomplete({
                            name: "educationComplex",
                            label: translate(`${trans}.educationComplex`),
                            queryName: "name",
                            serviceCallback: educationComplexService.list,
                            convertCallback: this.listItem
                        })}
                </Grid>
                <Grid item sm={3}>
                        {this.renderAutocomplete({
                            name: "mosque",
                            label: translate(`${trans}.mosque`),
                            queryName: "title",
                            serviceCallback: mosqueService.list,
                            convertCallback: this.mosqueListItem
                        })}
                </Grid>
                <Grid item sm={3}>
                    {this.renderInput({ name: "howzeName", label: translate(`${trans}.howzeName`) })}
                </Grid>
                <Grid item xs={3}>
                    {this.renderMultiSelect({
                        name: "status",
                        label: translate(`${trans}.status`),
                        options: schoolStatus
                    })}
                </Grid>
                <Grid item xs={3}>
                    {this.renderSelect({ name: "gender", label: translate(`${trans}.gender`), options: schoolGenders })}
                </Grid>
            </DoranFilterPanel>
        );
    }
}

SchoolListFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    schoolStatus: PropTypes.array.isRequired,
    schoolGenders: PropTypes.array.isRequired
};

export default withTranslation("school")(SchoolListFilter);
