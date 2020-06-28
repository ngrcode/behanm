import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, translateError, showToast } from "@doran/react";

// Services
import lessonService from "../../../core/services/lesson.service";

const trans = "lessonAdd.lessonAdd";
const validTrans = `${trans}.validation`;

class LessonAdd extends DoranForm {
    state = {
        data: this.props.lesson,
        errors: {},
        validate: true,
    };

    schema = {
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        type: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        school: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
    };

    handleSave = async (event) => {
        event.preventDefault();
        const { title, type, school } = this.state.data;

        await lessonService
            .save({ title, type: type.value, school: `/api/schools/${school.id}` })
            .then(({ data }) => {
                const { onCreate } = this.props;
                onCreate(data);

                const success = this.props.t(`${trans}.createdSuccessfully`, { title: data.title });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    render() {
        const { open, onClose, lessonTypes, t: translate } = this.props;
        const attributes = {
            open,
            onClose,
            title: translate(`${trans}.dialogTitle`),
            closeText: translate(`${trans}.closeText`),
            saveText: translate(`${trans}.saveText`),
            validate: this.validate,
            onSave: this.handleSave,
        };

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={8}>
                    {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                </Grid>
                <Grid item sm={4}>
                    {this.renderSelect({ name: "type", label: translate(`${trans}.type`), options: lessonTypes })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

LessonAdd.propTypes = {
    lesson: PropTypes.object.isRequired,
    lessonTypes: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

export default withTranslation("lesson")(LessonAdd);
