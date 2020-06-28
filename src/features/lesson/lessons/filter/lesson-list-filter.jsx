import React from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranFilterPanel} from "@doran/react";

const defaultFilter = { title: "", types: [], status: [] };
const trans = "lessons.filter.lessonListFilter";

class LessonListFilter extends DoranForm {
    state = {
        data: lodash.cloneDeep(defaultFilter),
    };

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
        const { t: translate, status, lessonTypes } = this.props;
        const attributes = {
            onFilter: this.handleFilterChange,
            onReset: this.handleReset,
            titleText: translate(`${trans}.titleText`),
            descriptionText: translate(`${trans}.descriptionText`),
            clearText: translate(`${trans}.clearText`),
            filterText: translate(`${trans}.filterText`),
        };

        return (
            <DoranFilterPanel {...attributes}>
                <Grid item sm={3}>
                    {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                </Grid>
                <Grid item sm={3}>
                    {this.renderMultiSelect({ name: "types", label: translate(`${trans}.types`), options: lessonTypes })}
                </Grid>
                <Grid item sm={3}>
                    {this.renderMultiSelect({ name: "status", label: translate(`${trans}.status`), options: status })}
                </Grid>
            </DoranFilterPanel>
        );
    }
}

LessonListFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    status: PropTypes.array.isRequired,
    lessonTypes: PropTypes.array.isRequired,
};

export default withTranslation("lesson")(LessonListFilter);
