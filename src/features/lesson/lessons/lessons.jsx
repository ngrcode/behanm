import React, { Component } from "react";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, showToast } from "@doran/react";

// Components
import LessonList from "./list/lesson-list";
import LessonListHeader from "./header/lesson-list-header";
import LessonListFilter from "./filter/lesson-list-filter";
import LessonAdd from "../lesson-add/lesson-add";
import LessonEdit from "../lesson-edit/lesson-edit";

// Services
import lessonService from "../../../core/services/lesson.service";

const trans = "lessons.lessons";
const defaultLesson = { title: "", type: null, school: null };

class Lessons extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        lesson: defaultLesson,
        school: lodash.pick(this.props.location.state, ["id", "title"]),
        translate: this.props.t,
        lessonTypes: [
            new ListItem("main", this.props.t(`${trans}.lessonTypes.main`)),
            new ListItem("innovative", this.props.t(`${trans}.lessonTypes.innovative`))
        ],
        status: [
            new ListItem(0, this.props.t(`${trans}.statuses.unpublished`)),
            new ListItem(1, this.props.t(`${trans}.statuses.published`)),
            new ListItem(2, this.props.t(`${trans}.statuses.draft`))
        ]
    };

    async componentDidUpdate(_, prevState) {
        if (prevState.pageNumber === this.state.pageNumber && prevState.filterCriteria === this.state.filterCriteria)
            return;

        await this.load();
    }

    handlePageNumberChange = (pageNumber) => {
        this.setState({ pageNumber: pageNumber + 1 });
    };

    handleFilter = (filterCriteria) => {
        this.setState({ filterCriteria, pageNumber: 1 });
    };

    toggleCreateDialog = () => {
        const { openCreateDialog, school } = this.state;
        const clonedLesson = Object.assign(defaultLesson, { school });
        this.setState({ openCreateDialog: !openCreateDialog, lesson: clonedLesson });
    };

    handleCreateLesson = (lesson) => {
        let { items, total } = this.state;
        items.unshift(lesson);
        this.setState({ items, total: total + 1 });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = (lesson) => {
        const { openUpdateDialog } = this.state;
        if (lesson && lesson.id) {
            const clonedItem = this.initializeEditLesson(lesson);
            this.setState({ openUpdateDialog: !openUpdateDialog, lesson: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, lesson: defaultLesson });
        }
    };

    handleUpdateLesson = (lesson) => {
        let { items, total } = this.state;
        const index = items.findIndex((e) => e.id === lesson.id);
        items.splice(index, 1, lesson);
        this.setState({ items, total });

        this.toggleUpdateDialog();
    };

    initializeEditLesson(lesson) {
        const { lessonTypes } = this.state;
        const { type } = lesson;
        let clonedItem = lodash.cloneDeep(lesson);
        clonedItem.type = lessonTypes.find((e) => e.value === type);

        return lodash.pick(clonedItem, ["id", "title", "type", "school"]);
    }

    toggleDeleteDialog = (lesson) => {
        const { openDeleteDialog } = this.state;
        if (lesson) {
            this.setState({
                openDeleteDialog: !openDeleteDialog,
                lesson: lesson
            });
        } else {
            this.setState({
                openDeleteDialog: !openDeleteDialog,
                lesson: defaultLesson
            });
        }
    };

    handleDeleteLesson = async (lesson) => {
        await lessonService
            .remove(lesson.id)
            .then(() => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === lesson.id);
                items.splice(index, 1);

                this.setState({
                    items,
                    total: total - 1,
                    openDeleteDialog: !openDeleteDialog
                });

                const success = this.state.translate(`${trans}.deletedSuccessfully`, { title: lesson.title });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.state.translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    async load() {
        const {
            pageNumber,
            filterCriteria: { title, types, status },
            school
        } = this.state;

        const filter = {
            title: title ? title : null,
            type: types ? types.map((e) => e.value) : null,
            status: status ? status.map((e) => e.value) : null,
            "school.id": school.id
        };

        await lessonService
            .list({ page: pageNumber, ...filter })
            .then(({ data }) => {
                this.setState({
                    items: data["hydra:member"],
                    total: data["hydra:totalItems"]
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const { items, total, pageSize, pageNumber, lesson, status, lessonTypes, school } = this.state;
        const { openCreateDialog, openUpdateDialog, openDeleteDialog } = this.state;
        const { t: translate } = this.props;

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <LessonAdd
                        lesson={lesson}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreateLesson}
                        school={school}
                        lessonTypes={lessonTypes}
                    />
                )}

                {openUpdateDialog && (
                    <LessonEdit
                        lesson={lesson}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdateLesson}
                        lessonTypes={lessonTypes}
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={lesson}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteLesson}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <LessonListHeader onDialog={this.toggleCreateDialog} school={school} />
                <LessonListFilter onFilterChange={this.handleFilter} status={status} lessonTypes={lessonTypes} />
                <LessonList
                    items={items}
                    total={total}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onEdit={this.toggleUpdateDialog}
                    onDelete={this.toggleDeleteDialog}
                    onPageNumberChange={this.handlePageNumberChange}
                    lessonTypes={lessonTypes}
                    status={status}
                />
            </React.Fragment>
        );
    }
}

export default withTranslation("lesson")(Lessons);
