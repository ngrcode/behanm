import React from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import { DoranForm, DoranDialogOperationPanel, ListItem } from "@doran/react";
import { translateError, base64ToFile, showToast } from "@doran/react";
import "@doran/react/dist/suneditor/css/suneditor.min.css";

// Services
import postService from "../../../core/services/post.service";
import categoryService from "../../../core/services/category.service";
import fileService from "../../../core/services/file.service";
import schoolService from "../../../core/services/school.service";

// Configs
import NoPicture from "../../../assets/images/no-picture.png";

const trans = "postAdd.postAdd";
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
class PostAdd extends DoranForm {
    state = {
        data: this.props.post,
        errors: {},
        validate: true
    };

    schema = {
        title: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        body: Joi.string()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        categories: Joi.array()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        categorySubject: Joi.array()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        contentGroup: Joi.array()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        postStatus: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        positionPublish: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        typePublish: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),    
        image: Joi.object()
            .required()
            .error((errors) => translateError(errors, validTrans, this.props.t)),
        school: Joi.object().error((errors) => translateError(errors, validTrans, this.props.t))
    };

    handleImageSave = async () => {
        let response = null;
        const { image } = this.state.data;

        const file = await base64ToFile(image);
        const data = new FormData();
        data.append("file", file);
        data.append("type", "");
        data.append("link", "");
        await fileService
            .create(data)
            .then(({ data }) => {
                response = data;
            })
            .catch((error) => {
                const { t: translate } = this.props;
                const message = translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message });
            });

        return response;
    };

    handleSave = async (event) => {
        event.preventDefault();

        const image = await this.handleImageSave();
        if (image === null) return;
        const { title, body, school: scl, categories, positionPublish:savePositionPublish, typePublish:saveTypePublish, postStatus ,contentGroup: saveContentGroup, categorySubject:saveCategorySubject} = this.state.data;
        // debugger;
        const file = `/api/files/${image.id}`;
        const school = `/api/schools/${scl.value}`;
        const category = categories.map((e) => `/api/categories/${e.value}`);
        const categorySubject = saveCategorySubject.map((e) => `/api/categories/${e.value}`);
        // const contentGroup = saveContentGroup.map((e) => `/api/categories/${e.value}`);
        const contentGroup = `/api/categories/${saveContentGroup.value}`;
        const positionPublish =  `/api/categories/${savePositionPublish.value}`;
        const typePublish =  `/api/categories/${saveTypePublish.value}`;
        await postService
            .save({ title, body, file, school, category, positionPublish, typePublish, postStatus , contentGroup, categorySubject })
            .then(({ data }) => { 
                const { onCreate, t: translate } = this.props;
                onCreate(data);

                const message = translate(`${trans}.createdSuccessfully`, { title });
                showToast({ variant: "success", message });
            })
            .catch(() => {
                const { t: translate } = this.props;
                const message = translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message });
            });
    };

    listItem = ({ data }) => {
        const items = data["hydra:member"];
        const d = items.map((e) => new ListItem({ value: e.id, label: e.title }));
        return d;
    };

    handleImage = (image) => {
        this.setState({ data: { ...this.state.data, file: image } });
    };

    render() {
        const { open, onClose, t: translate, classes, positionPublish, typePublish, postStatus } = this.props;
        const attributes = {
            open,
            onClose,
            size: "lg",
            title: translate(`${trans}.dialogTitle`),
            saveText: translate(`${trans}.saveText`),
            closeText: translate(`${trans}.closeText`),
            validate: this.validate,
            onSave: this.handleSave
        };

        return (
            <DoranDialogOperationPanel {...attributes}>
                <Grid item sm={4}>
                    <Grid item sm={12} className={classes.bottom}>
                        {this.renderInput({ name: "title", label: translate(`${trans}.title`) })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderAutocomplete({
                            name: "school",
                            label: translate(`${trans}.school`),
                            queryName: "title",
                            serviceCallback: schoolService.list,
                            convertCallback: this.listItem
                        })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderMultiSelectAutocomplete({
                            name: "categories",
                            label: translate(`${trans}.categories`),
                            queryName: "title",
                            serviceCallback: categoryService.list,
                            convertCallback: this.listItem
                        })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderMultiSelectAutocomplete({
                            name: "categorySubject",
                            label: translate(`${trans}.categorySubject`),
                            queryName: "title",
                            defaultCallbackObject: { type: "school" },
                            serviceCallback: categoryService.list,
                            convertCallback: this.listItem,
                        })}
                    </Grid> 
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderMultiSelectAutocomplete({
                            name: "contentGroup",
                            label: translate(`${trans}.contentGroup`),
                            queryName: "title",
                            defaultCallbackObject: { type: "post_content" },
                            serviceCallback: categoryService.list,
                            convertCallback: this.listItem,
                        })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderSelect({ name: "positionPublish",  label: translate(`${trans}.positionPublish`),options:positionPublish  })}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderSelect({  name: "typePublish", label: translate(`${trans}.typePublish`),  options:typePublish})}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderSelect({  name: "postStatus", label: translate(`${trans}.postStatus`),  options:postStatus})}
                    </Grid>
                    <Grid item sm={12} className={classes.topBottom}>
                        {this.renderImageInput({
                            name: "image",
                            emptyImage: NoPicture,
                            removeText: translate(`${trans}.imageRemoveText`),
                            uploadText: translate(`${trans}.imageUploadText`),
                            minHeight: "300px"
                        })}
                    </Grid>
                </Grid>
                <Grid item sm={8}>
                    {this.renderEditor({
                        name: "body",
                        label: translate(`${trans}.body`)
                    })}
                </Grid>
            </DoranDialogOperationPanel>
        );
    }
}

PostAdd.propTypes = {
    post: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onCreate: PropTypes.func.isRequired
};

export default withTranslation("post")(withStyles(styles)(PostAdd));
