import React from "react";
import Joi from "joi-browser";
import lodash from "lodash";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, ListItem } from "@doran/react";
import { translateError, base64ToFile, showToast } from "@doran/react";

// services
import userService from "../../../core/services/user.service";
import fileService from "../../../core/services/file.service";
import regionService from "../../../core/services/region.service";

// Configs
import NoPicture from "../../../assets/images/no-picture.png";

// models
import { withStyles } from "@material-ui/core";

const trans = "userEdit.userEdit";
const validTrans = `${trans}.validation`;

const styles = {
    bottom: {
        paddingBottom: 4
    },
    topBottom: {
        paddingTop: 4,
        paddingBottom: 4
    },
    contactSection: {
        marginTop: 20
    },
    contactTitleBox: {
        margin: "auto 0"
    },
    contactTitleLabel: {
        fontSize: "0.9rem"
    },
    contactAddBox: {
        textAlign: "right"
    },
    contactAddButton: {
        fontSize: ".7rem",
        color: "green"
    }
};

class UserEdit extends DoranForm {
    state = {
        data: this.props.user,
        errors: {},
        validate: true,
        translate: this.props.t,
        open: this.props.open
    };

    schema = {
        id: Joi.number().required(),
        firstName: Joi.string()
            .allow("")
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        lastName: Joi.string()
            .allow("")
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        nationalCode: Joi.string()
            .allow("")
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        username: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        birthDate: Joi.object()
            .allow("")
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        region: Joi.object()
            .allow()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        fatherName: Joi.string()
            .allow("")
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        gender: Joi.object()
            .allow(null)
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        isMarried: Joi.boolean()
            .allow(null)
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        file: Joi.object()
            .allow(null)
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        positions: Joi.array().error((errors) => translateError(errors, validTrans, this.props.t)),
        contacts: Joi.array().error((errors) => translateError(errors, validTrans, this.props.t))
    };

    handleSave = async (event) => {
        event.preventDefault();

        let { file } = this.state.data;
        if (file) {
            const { data } = await this.handleImageSave();
            if (!data) return;

            file = data;
        }

        const unchangedProperties = [
            "id",
            "username",
            "firstName",
            "lastName",
            "fatherName",
            "nationalCode",
            "isMarried"
        ];
        const item = lodash.pick(this.state.data, unchangedProperties);
        const { birthDate, gender, positions, contacts, region: rn } = this.state.data;

        const saveItem = Object.assign(item, {
            birthDate: new Date(birthDate),
            gender: gender ? gender.value : null,
            positions: positions.map((item) => item.value),
            contact: contacts.map((item) => ({ type: item.type.value, value: item.value })),
            file: file ? `/api/files/${file.id}` : null,
            region: `/api/regions/${rn.value}`
        });

        await userService
            .update(saveItem)
            .then(({ data }) => {
                const { onUpdate } = this.props;
                onUpdate(data);

                const success = this.props.t(`${trans}.updatedSuccessfully`, {
                    firstName: saveItem.firstName,
                    lastName: saveItem.lastName
                });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    handleImageSave = async () => {
        const { file } = this.state.data;
        let savedImage = null;

        const formData = new FormData();
        formData.append("file", await base64ToFile(file));
        formData.append("type", file.type);
        formData.append("link", null);
        await fileService
            .create(formData)
            .then((data) => (savedImage = data))
            .catch((error) => {
                const errorMessage = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });

        return savedImage;
    };

    listItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, e.name));
    };

    render() {
        console.log(this.props);
        const { open, onClose, contactTypes, t: translate, classes } = this.props;
        const { positions, genders } = this.props;
        const { file, contacts } = this.state.data;
        const attributes = {
            open,
            onClose,
            title: translate(`${trans}.dialogTitle`),
            validate: this.validate,
            onSave: this.handleSave,
            saveText: translate(`${trans}.saveText`),
            closeText: translate(`${trans}.closeText`)
        };

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={6}>
                    {this.renderInput({ name: "firstName", label: translate(`${trans}.firstName`) })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderInput({ name: "lastName", label: translate(`${trans}.lastName`) })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderInput({ name: "nationalCode", label: translate(`${trans}.nationalCode`), ltr: true })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderInput({ name: "username", label: translate(`${trans}.username`), ltr: true })}
                </Grid>
                <Grid item sm={6}>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderBirthDate({
                            name: "birthDate",
                            label: translate(`${trans}.birthDate`),
                            placeholder: "روز-ماه-سال"
                        })}
                    </Grid>
                    <Grid item sm={12} className={classes.bottom}>
                        {this.renderInput({ name: "fatherName", label: translate(`${trans}.fatherName`) })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderSelect({ name: "gender", label: translate(`${trans}.gender`), options: genders })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderCheckbox({ name: "isMarried", label: translate(`${trans}.isMarried`) })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderMultiSelect({
                            name: "positions",
                            label: translate(`${trans}.positions`),
                            options: positions
                        })}
                    </Grid>
                </Grid>
                <Grid item sm={6}>
                    {this.renderImageInput({
                        name: "file",
                        mainImage: file,
                        emptyImage: NoPicture,
                        removeText: translate(`${trans}.imageRemoveText`),
                        uploadText: translate(`${trans}.imageUploadText`)
                    })}
                </Grid>
                <Grid item sm={12} className={classes.topBottom}>
                    {this.renderAutocomplete({
                        name: "region",
                        label: translate(`${trans}.region`),
                        queryName: "name",
                        serviceCallback: regionService.list,
                        convertCallback: this.listItem
                    })}
                </Grid>
                <Grid item sm={12}>
                    {this.renderContact({
                        name: "contacts",
                        contactTypes,
                        contacts,
                        title: translate(`${trans}.contacts.title`),
                        addText: translate(`${trans}.contacts.add`),
                        inputLabelText: translate(`${trans}.contacts.inputLabel`),
                        selectLabelText: translate(`${trans}.contacts.selectLabel`),
                        emptyText: translate(`${trans}.contacts.emptyText`)
                    })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

export default withTranslation("user")(withStyles(styles)(UserEdit));
