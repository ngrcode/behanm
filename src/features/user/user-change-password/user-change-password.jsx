import React from "react";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import jalaliMoment from "jalali-moment";
import { DoranForm, DoranDialogOperationPanel, toastService } from "@doran/react";

// services
import userService from "../../../core/services/user.service";

// helpers
import translateError from "../../../shared/helpers/errorTranslator";

const trans = "features.user.userChangePassword.userChangePassword";
const validTrans = "features.user.userChangePassword.userChangePassword.validation";

class UserChangePassword extends DoranForm {
    state = {
        data: this.props.data,
        errors: {},
        validate: true,
        translate: this.props.t,
        open: this.props.open
    };

    schema = {
        _id: Joi.string().required(),
        password: Joi.string()
            .min(6)
            .max(100)
            .required()
            .error(errors => translateError(errors, validTrans, this.state.translate)),
        confirmPassword: Joi.string()
            .min(6)
            .max(100)
            .required()
            .error(errors => translateError(errors, validTrans, this.state.translate)),
        expiredOn: Joi.string()
            .regex(/^1[34]\d{2}-[01]\d-[0-3]\d [0-2]\d:[0-5]\d$/)
            .error(errors => translateError(errors, validTrans, this.state.translate))
    };

    handleSave = async event => {
        event.preventDefault();

        const format = "YYYY-MM-DD HH:mm";
        const { _id, password, expiredOn } = this.state.data;
        const saveItem = {
            _id,
            password: password,
            expiredOn: jalaliMoment
                .from(expiredOn, "fa", format)
                .locale("en")
                .toDate()
        };

        await userService
            .changePassword(saveItem)
            .then(item => {
                const {
                    data: { isSuccess, errors }
                } = item;

                if (isSuccess) {
                    const { onClose } = this.props;
                    onClose();

                    const success = this.state.translate(`${trans}.updatedSuccessfully`);
                    toastService.showToast({ variant: "success", message: success });
                } else {
                    toastService.showToast({ variant: "error", message: errors.map((e, i) => <div key={i}>{e}</div>) });
                }
            })
            .catch(error => {
                const errorMessage = this.state.translate(`${trans}.unexpectedError`);
                toastService.showToast({ variant: "error", message: errorMessage });
            });
    };

    render() {
        const { open, onClose, t: translate } = this.props;
        const attributes = {
            open,
            onClose,
            title: translate(`${trans}.dialogTitle`),
            validate: this.validate,
            onSave: this.handleSave
        };

        const dateMask = ["1", /[34]/, /\d/, /\d/, "-", /[01]/, /\d/, "-", /[0-3]/, /\d/];
        const timeMask = [/[0-2]/, /\d/, ":", /[0-5]/, /\d/];
        const expiredOnMask = [...dateMask, " ", ...timeMask];

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={6}>
                    {this.renderInput(translate(`${trans}.password`), "password", true, "password")}
                </Grid>
                <Grid item sm={6}>
                    {this.renderInput(translate(`${trans}.confirmPassword`), "confirmPassword", true, "password")}
                </Grid>
                <Grid item sm={6}>
                    {this.renderInput(translate(`${trans}.expiredOn`), "expiredOn", true, "expiredOn", expiredOnMask)}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

export default withTranslation("translations")(UserChangePassword);
