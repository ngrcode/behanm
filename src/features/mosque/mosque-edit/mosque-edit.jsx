import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import { DoranForm, DoranDialogOperationPanel, ListItem } from "@doran/react";
import { translateError, showToast } from "@doran/react";

// Services
import mosqueService from "../../../core/services/mosque.service";
import regionService from "../../../core/services/region.service";
import userService from "../../../core/services/user.service";

const trans = "mosqueEdit.mosqueEdit";
const validTrans = `${trans}.validation`;

const styles = {
    bottom: {
        paddingBottom: 4
    },
    topBottom: {
        paddingTop: 4,
        paddingBottom: 4
    }
};
class MosqueEdit extends DoranForm {
    state = {
        data: this.props.mosque,
        errors: {},
        validate: true
    };

    schema = {
        id: Joi.number().required(),
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        code: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        imamName: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        region: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        howze: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        person: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        contacts: Joi.array().error((errors) => translateError(errors, validTrans, this.props.t)),
        coordinates: Joi.array().error((errors) => translateError(errors, validTrans, this.props.t))
    };

    handleSave = async (event) => {
        event.preventDefault();

        const { id, title, imamName, code, region: rn, howze: hz, person: pr, contacts, coordinates } = this.state.data;
        const region = `/api/regions/${rn.value}`;
        const howze = `/api/regions/${hz.value}`;
        const person = `/api/people/${pr.value}`;
        const contact = contacts.map((e) => {
            return { type: e.type.value, value: e.value };
        });
        const coordinate = coordinates.map((e) => {
            return { lat: `${e.lat}`, lng: `${e.lng}` };
        });

        await mosqueService
            .save({ id, title, imamName, code, region, howze, person, contact, coordinate })
            .then(({ data }) => {
                const { onUpdate } = this.props;
                onUpdate(data);

                const success = this.props.t(`${trans}.updatedSuccessfully`, { title: title });
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
        const { open, onClose, contactTypes, t: translate, classes } = this.props;
        const attributes = {
            open,
            onClose,
            size: "md",
            title: translate(`${trans}.dialogTitle`),
            saveText: translate(`${trans}.saveText`),
            closeText: translate(`${trans}.closeText`),
            validate: this.validate,
            onSave: this.handleSave
        };

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={6}>
                    <Grid item sm={12} className={classes.bottom}>
                        {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderInput({ name: "imamName", label: translate(`${trans}.imamName`) })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderAutocomplete({
                            name: "region",
                            label: translate(`${trans}.region`),
                            queryName: "name",
                            serviceCallback: regionService.list,
                            convertCallback: this.regionListItem
                        })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderAutocomplete({
                            name: "howze",
                            label: translate(`${trans}.howze`),
                            queryName: "name",
                            serviceCallback: regionService.list,
                            convertCallback: this.regionListItem
                        })}
                    </Grid>
                    <Grid item sm={6} className={classes.topBottom}>
                        {this.renderInput({ name: "code", label: translate(`${trans}.code`), ltr: true })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderAutocomplete({
                            name: "person",
                            label: translate(`${trans}.person`),
                            queryName: "lastName",
                            serviceCallback: userService.list,
                            convertCallback: this.personListItem
                        })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderContact({
                            name: "contacts",
                            contactTypes,
                            title: translate(`${trans}.contacts.title`),
                            addText: translate(`${trans}.contacts.add`),
                            inputLabelText: translate(`${trans}.contacts.inputLabel`),
                            selectLabelText: translate(`${trans}.contacts.selectLabel`),
                            emptyText: translate(`${trans}.contacts.emptyText`)
                        })}
                    </Grid>
                </Grid>
                <Grid item sm={6}>
                    {this.renderMap({ name: "coordinates", zoom: 10, center: { lat: 35.8075554, lng: 51.1004727 } })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

MosqueEdit.propTypes = {
    mosque: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
    contactTypes: PropTypes.array.isRequired
};

export default withTranslation("mosque")(withStyles(styles)(MosqueEdit));
