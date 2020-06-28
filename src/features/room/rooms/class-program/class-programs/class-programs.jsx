import React, { Component } from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, showToast } from "@doran/react";

// Components
import ClassProgramList from "./list/class-program-list";
import ClassProgramListHeader from "./header/class-program-list-header";
import { ClassProgramAdd } from "../class-program-add";
import { ClassProgramEdit } from "../class-program-edit";

// Services
import classProgramService from "../../../../../core/services/class-program.service";

const trans = "classPrograms.classPrograms";
const defaultClassProgram = {
    title: "",
    day: "",
    zang: "",
    lesson: null,
    person: null
};

class ClassPrograms extends Component {
    state = {
        items: [],
        initializedItems: [],
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        showSecondThreeColumns: false,
        classProgram: lodash.cloneDeep(defaultClassProgram),
        breaks: [
            new ListItem("firstBreak", this.props.t(`${trans}.breaks.firstBreak`)),
            new ListItem("secondBreak", this.props.t(`${trans}.breaks.secondBreak`)),
            new ListItem("thirdBreak", this.props.t(`${trans}.breaks.thirdBreak`)),
            new ListItem("fourthBreak", this.props.t(`${trans}.breaks.fourthBreak`)),
            new ListItem("fifthBreak", this.props.t(`${trans}.breaks.fifthBreak`)),
            new ListItem("sixthBreak", this.props.t(`${trans}.breaks.sixthBreak`))
        ],
        days: [
            new ListItem("saturday", this.props.t(`${trans}.days.saturday`)),
            new ListItem("sunday", this.props.t(`${trans}.days.sunday`)),
            new ListItem("monday", this.props.t(`${trans}.days.monday`)),
            new ListItem("tuesday", this.props.t(`${trans}.days.tuesday`)),
            new ListItem("wednesday", this.props.t(`${trans}.days.wednesday`)),
            new ListItem("thursday", this.props.t(`${trans}.days.thursday`)),
            new ListItem("friday", this.props.t(`${trans}.days.friday`))
        ]
    };

    async componentWillMount(_, prevState) {
        this.load();
    }

    componentDidUpdate(prevProps, _) {
        if (prevProps.homeClass === this.props.homeClass) return;

        this.load();
    }

    toggleCreateDialog = () => {
        const { openCreateDialog } = this.state;
        this.setState({ openCreateDialog: !openCreateDialog, classProgram: lodash.cloneDeep(defaultClassProgram) });
    };

    handleCreateClassProgram = (classProgram) => {
        let { items } = this.state;
        items.unshift(classProgram);
        this.setState({ items });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = (classProgram) => {
        const { openUpdateDialog } = this.state;
        if (classProgram && classProgram.id) {
            const clonedItem = this.initializeEditClassProgram(classProgram);
            this.setState({ openUpdateDialog: !openUpdateDialog, classProgram: clonedItem });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, classProgram: lodash.cloneDeep(defaultClassProgram) });
        }
    };

    handleUpdateClassProgam = (classProgram) => {
        let { items } = this.state;
        const index = items.findIndex((e) => e.id === classProgram.id);
        items.splice(index, 1, classProgram);
        this.setState({ items });

        this.toggleUpdateDialog();
    };

    initializeEditClassProgram = (classProgram) => {
        const { breaks, days } = this.state;
        const { id, title, zang, day, lesson, person } = classProgram;
        const clonedItem = { id, title };
        clonedItem.zang = breaks.find((e) => e.value === zang);
        clonedItem.day = days.find((e) => e.value === day);
        clonedItem.lesson = new ListItem(lesson.id, lesson.title);
        clonedItem.person = new ListItem(person.id, `${person.firstName} ${person.lastName}`);

        return clonedItem;
    };

    toggleDeleteDialog = (classProgram) => {
        const { openDeleteDialog } = this.state;
        if (classProgram) {
            this.setState({ openDeleteDialog: !openDeleteDialog, classProgram: classProgram });
        } else {
            this.setState({ openDeleteDialog: !openDeleteDialog, classProgram: lodash.cloneDeep(defaultClassProgram) });
        }
    };

    handleDeleteClassProgram = async (classProgram) => {
        await classProgramService
            .remove(classProgram.id)
            .then(() => {
                const { items, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === classProgram.id);
                items.splice(index, 1);

                this.setState({ items, openDeleteDialog: !openDeleteDialog });

                const message = this.props.t(`${trans}.deletedSuccessfully`, { title: classProgram.title });
                showToast({ variant: "success", message });
            })
            .catch(() => {
                const message = this.props.t(`${trans}.unexpectedError`);
                showToast({ variant: "error", message });
            });
    };

    load = async () => {
        let pageNumber = 0;
        let totalCount = 0;
        let collection = [];

        do {
            pageNumber++;
            const { items, total } = await this.loadPagination(pageNumber);

            collection = Object.assign(collection, items);
            totalCount = total;
        } while (totalCount > 0 && collection.length < totalCount);

        this.setState({ items: collection, total: totalCount });
    };

    loadPagination = async (page) => {
        const { school, homeClass } = this.props;

        const query = {
            page: page,
            "school.id": school.id,
            "homeClass.id": homeClass.id
        };

        const result = await classProgramService
            .list(query)
            .then(({ data }) => {
                return { items: data["hydra:member"], total: data["hydra:totalItems"] };
            })
            .catch((error) => {});

        return result;
    };

    onShowColumnsChange = () => {
        const { showSecondThreeColumns } = this.state;
        this.setState({ showSecondThreeColumns: !showSecondThreeColumns });
    };

    initialize = () => {
        const { items } = this.state;
        const days = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];
        const breaks = ["firstBreak", "secondBreak", "thirdBreak", "fourthBreak", "fifthBreak", "sixthBreak"];
        let collection = [];
        days.forEach((day, index) => {
            const element = { id: index, day: days[index], breaks: [] };
            breaks.forEach((breakItem, breakIndex) => {
                element.breaks[breakIndex] = items.filter((e) => e.day === day && e.zang === breakItem);
            });

            collection.push(element);
        });

        return collection;
    };

    render() {
        const { openCreateDialog, openUpdateDialog, openDeleteDialog } = this.state;
        const { classProgram, breaks, days, showSecondThreeColumns } = this.state;
        const { t: translate, homeClass, school } = this.props;

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <ClassProgramAdd
                        classProgram={classProgram}
                        school={school}
                        homeClass={homeClass}
                        breaks={breaks}
                        days={days}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreateClassProgram}
                    />
                )}

                {openUpdateDialog && (
                    <ClassProgramEdit
                        classProgram={classProgram}
                        school={school}
                        homeClass={homeClass}
                        breaks={breaks}
                        days={days}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdateClassProgam}
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={classProgram}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteClassProgram}
                        titleText={translate(`${trans}.titleText`)}
                        contentText={translate(`${trans}.contentText`)}
                        agreeText={translate(`${trans}.agreeText`)}
                        disagreeText={translate(`${trans}.disagreeText`)}
                    />
                )}

                <ClassProgramListHeader
                    onDialog={this.toggleCreateDialog}
                    showSecondThreeColumns={showSecondThreeColumns}
                    onShowColumnsChange={this.onShowColumnsChange}
                    homeClass={homeClass}
                />
                <ClassProgramList
                    items={this.initialize()}
                    showSecondThreeColumns={showSecondThreeColumns}
                    onEdit={this.toggleUpdateDialog}
                    onDelete={this.toggleDeleteDialog}
                />
            </React.Fragment>
        );
    }
}

ClassPrograms.propTypes = {
    school: PropTypes.object.isRequired,
    homeClass: PropTypes.object.isRequired
};

export default withTranslation("classProgram")(ClassPrograms);
