import React from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { DoranForm } from "@doran/react";

const styles = {
    root: {
        width: "90%",
        float: "left",
        margin: "0px",
    },
    filter: {
        float: "left",
    },
};

const defaultFilter = { title: "", year: "" };
const trans = "homeClasses.homeClasses.filter";

class HomeClassListFilter extends DoranForm {
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
        const { t: translate } = this.props;

        return (
            <Grid container spacing={1} style={styles.root}>
                <Grid item sm={6}>
                    {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderInput({ name: "year", label: translate(`${trans}.year`) })}
                </Grid>
                <Grid item sm={12}>
                    <Button size="small" onClick={() => this.handleReset()}>
                        {translate(`${trans}.clearText`)}
                    </Button>
                    <Button size="small" color="primary" onClick={() => this.handleFilterChange()} style={styles.filter}>
                        {translate(`${trans}.filterText`)}
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

HomeClassListFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
};

export default withTranslation("homeClass")(HomeClassListFilter);
