import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import { DoranForm, DoranDialogOperationPanel, ListItem } from "@doran/react";
import { translateError, showToast } from "@doran/react";

// Services
import schoolService from "../../../core/services/school.service";
import mosqueService from "../../../core/services/mosque.service";
import regionService from "../../../core/services/region.service";
import educationComplexService from "../../../core/services/education-complex.service";

const trans = "schoolAdd.schoolAdd";
const validTrans = `${trans}.validation`;

const styles = {
    firstHalfGrid: {
        display: "inline-block",
        width: "100%",
        paddingBottom: 4,
        paddingRight: 4
    },
    secondHalfGrid: {
        display: "inline-block",
        width: "100%",
        paddingBottom: 4,
        paddingLeft: 4
    },
    bottom: {
        paddingBottom: 4
    },
    topBottom: {
        paddingTop: 4,
        paddingBottom: 4
    }
};
class SchoolAdd extends DoranForm {
    state = {
        data: this.props.school,
        errors: {},
        validate: true
    };

    schema = {
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        gender: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        educationComplex: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        region: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        mosque: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        howze: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        contacts: Joi.array().error((errors) => translateError(errors, validTrans, this.props.t)),
        coordinates: Joi.array().error((errors) => translateError(errors, validTrans, this.props.t))
    };

    handleSave = async (event) => {
        event.preventDefault();

        const {
            title,
            gender,
            educationComplex: ec,
            region: rn,
            mosque: ms,
            howze: hz,
            contacts,
            coordinates
        } = this.state.data;
        const educationComplex = `/api/education_complexes/${ec.value}`;
        const region = `/api/regions/${rn.value}`;
        const mosque = `/api/mosques/${ms.value}`;
        const howze = `/api/regions/${hz.value}`;
        const contact = contacts.map((e) => {
            return { type: e.type.value, value: e.value };
        });
        const coordinate = coordinates.map((e) => {
            return { lat: `${e.lat}`, lng: `${e.lng}` };
        });
        await schoolService
            .save({ title, gender: gender.value, educationComplex, region, mosque, howze, contact, coordinate })
            .then(({ data }) => {
                const { onCreate } = this.props;
                onCreate(data);

                const success = this.props.t(`${trans}.createdSuccessfully`, { title });
                showToast({ variant: "success", message: success });
            })
            .catch(() => {
                const errorMessage = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    regionListItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, e.name));
    };

    educationComplexListItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, e.name));
    };

    mosqueListItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, e.title));
    };

    render() {
        const { open, onClose, contactTypes, schoolGenders, t: translate, classes } = this.props;
        const attributes = {
            open,
            onClose,
            size: "md",
            title: translate(`${trans}.dialogTitle`),
            closeText: translate(`${trans}.closeText`),
            saveText: translate(`${trans}.saveText`),
            validate: this.validate,
            onSave: this.handleSave
        };

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={6}>
                    <Grid item sm={8} className={classes.firstHalfGrid}>
                        {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                    </Grid>
                    <Grid item sm={4} className={classes.secondHalfGrid}>
                        {this.renderSelect({
                            name: "gender",
                            label: translate(`${trans}.gender`),
                            options: schoolGenders
                        })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderAutocomplete({
                            name: "educationComplex",
                            label: translate(`${trans}.educationComplex`),
                            queryName: "name",
                            serviceCallback: educationComplexService.list,
                            convertCallback: this.educationComplexListItem
                        })}
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
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderAutocomplete({
                            name: "mosque",
                            label: translate(`${trans}.mosque`),
                            queryName: "title",
                            serviceCallback: mosqueService.list,
                            convertCallback: this.mosqueListItem
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

SchoolAdd.propTypes = {
    school: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onCreate: PropTypes.func.isRequired,
    contactTypes: PropTypes.array.isRequired,
    schoolGenders: PropTypes.array.isRequired
};

export default withTranslation("school")(withStyles(styles)(SchoolAdd));
