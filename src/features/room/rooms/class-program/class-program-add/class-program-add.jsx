import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, ListItem } from "@doran/react";
import { translateError, showToast } from "@doran/react";

// Services
import classProgramService from "../../../../../core/services/class-program.service";
import lessonService from "../../../../../core/services/lesson.service";
import userService from "../../../../../core/services/user.service";

const trans = "classProgramAdd.classProgramAdd";
const validTrans = `${trans}.validation`;

class ClassProgramAdd extends DoranForm {
    state = {
        data: this.props.classProgram,
        errors: {},
        validate: true
    };

    schema = {
        lesson: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        person: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        day: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        zang: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t))
    };

    handleSave = async (event) => {
        event.preventDefault();

        const { school, homeClass } = this.props;
        const { title, day, zang, lesson, person } = this.state.data;
        const item = {
            title,
            day: day.value,
            zang: zang.value,
            lesson: `api/lessons/${lesson.value}`,
            person: `api/people/${person.value}`,
            school: `api/schools/${school.id}`,
            homeClass: `api/home_classes/${homeClass.id}`
        };

        await classProgramService
            .save(item)
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

    listItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, e.title));
    };

    personListItem = ({ data }) => {
        const items = data["hydra:member"];
        return items.map((e) => new ListItem(e.id, `${e.firstName} ${e.lastName}`));
    };

    render() {
        const { breaks, days, open, onClose, t: translate, school } = this.props;
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
                    {this.renderAutocomplete({
                        name: "lesson",
                        label: translate(`${trans}.lesson`),
                        queryName: "title",
                        defaultCallbackObject: { "school.id": school.id },
                        serviceCallback: lessonService.list,
                        convertCallback: this.listItem
                    })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderAutocomplete({
                        name: "person",
                        label: translate(`${trans}.person`),
                        queryName: "lastName",
                        // defaultCallbackObject: { "roles.name": "ًROLE_TEACHER", "schools.id": school.id },
                        defaultCallbackObject: { "positions.name": "TEACHER" },
                        serviceCallback: userService.list,
                        convertCallback: this.personListItem
                    })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderSelect({ name: "day", label: translate(`${trans}.day`), options: days })}
                </Grid>
                <Grid item sm={6}>
                    {this.renderSelect({ name: "zang", label: translate(`${trans}.zang`), options: breaks })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

ClassProgramAdd.propTypes = {
    classProgram: PropTypes.object.isRequired,
    school: PropTypes.object.isRequired,
    homeClass: PropTypes.object.isRequired,
    breaks: PropTypes.array.isRequired,
    days: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onCreate: PropTypes.func.isRequired
};

export default withTranslation("classProgram")(ClassProgramAdd);
