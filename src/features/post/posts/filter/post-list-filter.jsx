import React from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import {DoranFilterPanel, DoranForm} from "@doran/react";

const defaultFilter = { title: "", categoryTitle: "", schoolTitle: "", status: [] };
const trans = "posts.filter.postListFilter";

class PostListFilter extends DoranForm {
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
        const { t: translate, postStatus } = this.props;

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
                <Grid item sm={3}>
                    {this.renderInput({ name: "categoryTitle", label: translate(`${trans}.categoryTitle`) })}
                </Grid>
                <Grid item sm={3}>
                    {this.renderInput({ name: "schoolTitle", label: translate(`${trans}.schoolTitle`) })}
                </Grid>
                <Grid item xs={3}>
                    {this.renderMultiSelect({ name: "status", label: translate(`${trans}.status`), options: postStatus })}
                </Grid>
            </DoranFilterPanel>
        );
    }
}

PostListFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    postStatus: PropTypes.array.isRequired,
};

export default withTranslation("post")(PostListFilter);
