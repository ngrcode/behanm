import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, ListItem } from "@doran/react";
import { translateError, showToast } from "@doran/react";

// Services
import regionService from "../../../core/services/region.service";

const trans = "regionAdd.regionAdd";
const validTrans = `${trans}.validation`;

class RegionAdd extends DoranForm {
    state = {
        data: this.props.region,
        errors: {},
        validate: true
    };

    schema = {
        name: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        code: Joi.number()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        nameLong: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        type: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        parent: Joi.object()
            .allow(null)
            .error((errors) => translateError(errors, validTrans, this.props.t))
    };

    handleSave = async (event) => {
        event.preventDefault();

        const { name, code, nameLong, type, parent: p } = this.state.data;
        const parent = p ? `api/regions/${p.value}` : null;
        await regionService
            .save({ name, code: +code, nameLong, type: type.value, parent })
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

    listItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, e.name));
    };

    render() {
        const { regionTypes, open, onClose, t: translate } = this.props;
        const attributes = {
            open,
            onClose,
            title: translate(`${trans}.dialogTitle`),
            saveText: translate(`${trans}.saveText`),
            closeText: translate(`${trans}.closeText`),
            validate: this.validate,
            onSave: this.handleSave
        };

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={6}>
                    {this.renderInput({ name: "name", label: translate(`${trans}.name`) })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderInput({ name: "code", label: translate(`${trans}.code`), ltr: true })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderInput({ name: "nameLong", label: translate(`${trans}.nameLong`) })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderSelect({ name: "type", label: translate(`${trans}.type`), options: regionTypes })}
                </Grid>
                <Grid item sm={12}>
                    {this.renderAutocomplete({
                        name: "parent",
                        label: translate(`${trans}.parent`),
                        queryName: "name",
                        serviceCallback: regionService.list,
                        convertCallback: this.listItem
                    })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

RegionAdd.propTypes = {
    region: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onCreate: PropTypes.func.isRequired,
    regionTypes: PropTypes.array.isRequired
};

export default withTranslation("region")(RegionAdd);
