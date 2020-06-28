import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, ListItem } from "@doran/react";
import { translateError, showToast } from "@doran/react";

// Services
import regionService from "../../../core/services/region.service";
import userService from "../../../core/services/user.service";
import educationComplexService from "../../../core/services/education-complex.service";

const trans = "educationComplexAdd.educationComplexAdd";
const validTrans = `${trans}.validation`;

class EducationComplexAdd extends DoranForm {
    state = {
        data: this.props.educationComplex,
        errors: {},
        validate: true
    };

    schema = {
        name: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        region: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        person: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t))
    };

    handleSave = async (event) => {
        event.preventDefault();

        const { name, region: rn, person: pn } = this.state.data;
        const region = `/api/regions/${rn.value}`;
        const person = `/api/people/${pn.value}`;

        await educationComplexService
            .save({ name, region, person })
            .then(({ data }) => {
                const { onCreate } = this.props;
                onCreate(data);

                const success = this.props.t(`${trans}.createdSuccessfully`, { name: name });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    regionListItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, e.name));
    };
    personListItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, `${e.firstName} ${e.lastName}`));
    };

    render() {
        const { open, onClose, size, t: translate } = this.props;
        const attributes = {
            open,
            onClose,
            size,
            title: translate(`${trans}.dialogTitle`),
            closeText: translate(`${trans}.closeText`),
            saveText: translate(`${trans}.saveText`),
            validate: this.validate,
            onSave: this.handleSave
        };

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={12}>
                    {this.renderInput({
                        name: "name",
                        label: translate(`${trans}.name`)
                    })}
                </Grid>
                <Grid item sm={12}>
                    {this.renderAutocomplete({
                        name: "region",
                        label: translate(`${trans}.region`),
                        queryName: "name",
                        serviceCallback: regionService.list,
                        convertCallback: this.regionListItem
                    })}
                </Grid>
                <Grid item sm={12}>
                    {this.renderAutocomplete({
                        name: "person",
                        label: translate(`${trans}.person`),
                        queryName: "lastName",
                        serviceCallback: userService.list,
                        convertCallback: this.personListItem
                    })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

EducationComplexAdd.propTypes = {
    educationComplex: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func
};

export default withTranslation("educationComplex")(EducationComplexAdd);
