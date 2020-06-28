import React from "react";
import lodash from "lodash";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { ListItem, DoranForm, DoranFilterPanel } from "@doran/react";
import schoolService from "../../../../core/services/school.service";



const defaultFilter = { username: "", lastName: "", contact: "", position: null, status: [], school: null };
const trans = "users.filter.userListFilter";

class UserListFilter extends DoranForm {
    state = {
        data: this.defaultFilter(),
        translate: this.props.t,
        onFilterChange: this.props.onFilterChange,
    };

    defaultFilter() {
        const filter = lodash.cloneDeep(defaultFilter);
        if (this.props.school && this.props.position) {
            filter.school = this.props.school;
            filter.position = this.props.position;
        } 
        return filter;
    }

    async componentDidMount() {
        this.handleFilterChange();
    }

    handleFilterChange = () => {
         const { onFilterChange, data } = this.state;
        onFilterChange(data);
    };

    handleReset = () => {
        const filter = lodash.cloneDeep(defaultFilter);
        this.setState({ data: filter });

        const { onFilterChange } = this.state;
        onFilterChange(filter);
    };

    listItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id,  e.title ));
    };

    render() {
        const { t: translate, positions, status } = this.props;
        const translator = {
            onFilter: this.handleFilterChange,
            onReset: this.handleReset,
            titleText: translate(`${trans}.titleText`),
            descriptionText: translate(`${trans}.descriptionText`),
            clearText: translate(`${trans}.clearText`),
            filterText: translate(`${trans}.filterText`),
        };

        return (
            <DoranFilterPanel {...translator}>
                <Grid item sm={3}>
                    {this.renderInput({ name: "username", label: translate(`${trans}.username`), ltr: true })}
                </Grid>
                <Grid item sm={3}>
                    {this.renderInput({ name: "lastName", label: translate(`${trans}.lastName`) })}
                </Grid> 
                <Grid item sm={3}>
                        {this.renderAutocomplete({
                            name: "school",
                            label: translate(`${trans}.school`),
                            queryName: "title",
                            serviceCallback: schoolService.list,
                            convertCallback: this.listItem
                        })}
                </Grid>
               
                <Grid item sm={3}>
                    {this.renderInput({ name: "contact", label: translate(`${trans}.contact`) })}
                </Grid>
                <Grid item sm={3}>                    
                    {this.renderSelect({ name: "position", label: translate(`${trans}.position`), options: positions })}
                </Grid>
                <Grid item sm={3}>
                    {this.renderMultiSelect({ name: "status", label: translate(`${trans}.status`), options: status })}
                </Grid>
            </DoranFilterPanel>
        );
    }
}

export default withTranslation("user")(UserListFilter);
