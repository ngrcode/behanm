import React, { Component } from "react";
import lodash from "lodash";
import { withTranslation } from "react-i18next";
import { DoranRemoveDialog, ListItem, urlToBase64Post, showToast, toJalali } from "@doran/react";
// components
import UserList from "./list/user-list";
import UserListHeader from "./header/user-list-header";
import UserListFilter from "./filter/user-list-filter";
import UserAdd from "../user-add/user-add";
import UserEdit from "../user-edit/user-edit";

// services
import userService from "../../../core/services/user.service";
import positionService from "../../../core/services/position.service";

// Configs
import { apiUrl } from "../../../config.json";

const trans = "users.users";

const defaultUser = {
    firstName: "",
    lastName: "",
    nationalCode: "",
    region: null,
    username: "",
    password: "",
    birthDate: "",
    fatherName: "",
    gender: null,
    isMarried: false,
    file: null,
    positions: [],
    contacts: [],
};

class Users extends Component {
    state = {
        items: [],
        total: 0,
        pageSize: 30,
        pageNumber: 1,
        filterCriteria: null,
        openCreateDialog: false,
        openUpdateDialog: false,
        openDeleteDialog: false,
        // openChangePasswordDialog: false,
        // passwordChange: defaultPasswordChange,
        // selectedUser: null,
        translate: this.props.t,
        school: (this.props.location.state && this.props.location.state.school) || null,
        positions: [],
        postion: null,
        status: [
            new ListItem(0, this.props.t(`${trans}.status.unpublished`)),
            new ListItem(1, this.props.t(`${trans}.status.published`)),
            new ListItem(2, this.props.t(`${trans}.status.draft`)),
        ],
        genders: [
            new ListItem("man", this.props.t(`${trans}.genders.man`)),
            new ListItem("woman", this.props.t(`${trans}.genders.woman`)),
        ],
        contactTypes: [
            new ListItem(0, this.props.t(`${trans}.contactTypes.phone`)),
            new ListItem(1, this.props.t(`${trans}.contactTypes.mobile`)),
            new ListItem(2, this.props.t(`${trans}.contactTypes.email`)),
            new ListItem(3, this.props.t(`${trans}.contactTypes.address`)),
            new ListItem(4, this.props.t(`${trans}.contactTypes.website`)),
            new ListItem(5, this.props.t(`${trans}.contactTypes.fax`)),
        ],
    };

    // componentDidMount() {
    //     defaultUser.roles.push(this.state.roles[0]);
    // }

    async componentDidUpdate(_, prevState) {
        if (prevState.pageNumber === this.state.pageNumber && prevState.filterCriteria === this.state.filterCriteria)
            return;

        await this.loadPositions();
        await this.loadUsers();
    }

    handlePageNumberChange = (pageNumber) => {
        this.setState({ pageNumber: pageNumber + 1 });
    };

    handleFilter = (filterCriteria) => {
        this.setState({ filterCriteria, pageNumber: 1 });
    };

    toggleCreateDialog = () => {
        const { openCreateDialog } = this.state;
        this.setState({ openCreateDialog: !openCreateDialog, user: lodash.cloneDeep(defaultUser) });
    };

    handleCreateUser = (createdUser) => {
        let { items, total } = this.state;
        items.unshift(createdUser);
        this.setState({ items, total: total + 1 });

        this.toggleCreateDialog();
    };

    toggleUpdateDialog = async (user) => {
        const { openUpdateDialog } = this.state;
        if (user && user.id) {
            let clonedUser = await this.initializeEditUser(user);
            this.setState({ openUpdateDialog: !openUpdateDialog, user: clonedUser });
        } else {
            this.setState({ openUpdateDialog: !openUpdateDialog, user: defaultUser });
        }
    };

    async initializeEditUser(user) {
        let cloned = lodash.cloneDeep(user);
        const { positions, genders, contactTypes } = this.state;
        cloned.birthDate = cloned.birthDate ? toJalali(cloned.birthDate) : cloned.birthDate;

        const userPositions = cloned.positions.map((e) => e["@id"]);
        cloned.positions = lodash.filter(positions, (o) => userPositions.indexOf(o.value) >= 0);
        cloned.gender = cloned.gender ? genders.find((e) => e.value === cloned.gender) : null;
        cloned.region = !!cloned.region ? new ListItem(cloned.region.id, cloned.region.name) : null;
        cloned.contacts = cloned.contact
            ? cloned.contact.map((e) => {
                  return { value: e.value, type: contactTypes.find((ct) => ct.value === e.type) };
              })
            : [];
        cloned.file = !!cloned.file
            ? await urlToBase64Post(`${apiUrl}/api/files/images`, {
                  image: cloned.file.url.slice(7, cloned.file.url.length),
              })
            : null;

        const props = [
            "id",
            "firstName",
            "lastName",
            "nationalCode",
            "region",
            "username",
            "birthDate",
            "fatherName",
            "gender",
            "isMarried",
            "file",
            "positions",
            "contacts",
        ];
        // console.log(user)
        // console.log(cloned)
        return lodash.pick(cloned, props);
    }

    handleUpdateUser = (updatedUser) => {
        let { items, total } = this.state;
        const index = items.findIndex((e) => e.id === updatedUser.id);
        items.splice(index, 1, updatedUser);
        this.setState({ items, total });

        this.toggleUpdateDialog();
    };

    toggleDeleteDialog = (item) => {
        const { openDeleteDialog } = this.state;
        if (item) {
            this.setState({ openDeleteDialog: !openDeleteDialog, user: item });
        } else {
            this.setState({ openDeleteDialog: !openDeleteDialog, user: defaultUser });
        }
    };

    handleDeleteUser = async (user) => {
        await userService
            .remove(user.id)
            .then((result) => {
                const { items, total, openDeleteDialog } = this.state;
                const index = items.findIndex((e) => e.id === user.id);
                items.splice(index, 1);

                this.setState({ items, total: total - 1, openDeleteDialog: !openDeleteDialog });

                const success = this.state.translate(`${trans}.deletedSuccessfully`, {
                    firstName: user.firstName,
                    lastName: user.lastName,
                });
                showToast({ variant: "success", message: success });
            })
            .catch((error) => {
                const errorMessage = this.state.translate(`${trans}.unexpectedError`);
                showToast({ variant: "error", message: errorMessage });
            });
    };

    // toggleChangePasswordDialog = user => {
    //     const { openChangePasswordDialog, passwordChange } = this.state;

    //     if (user) {
    //         const { _id } = user;
    //         this.setState({
    //             openChangePasswordDialog: !openChangePasswordDialog,
    //             passwordChange: { ...passwordChange, _id }
    //         });
    //     } else {
    //         this.setState({ openChangePasswordDialog: !openChangePasswordDialog });
    //     }
    // };

    // resetPassword = async item => {
    //     const index = this.state.items.findIndex(e => e._id === item._id);
    //     const items = [...this.state.items];

    //     await userService
    //         .resetPassword(items[index])
    //         .then(result => {
    //             const {
    //                 data: { isSuccess, errors, value }
    //             } = result;

    //             if (isSuccess) {
    //                 const success = this.state.translate(`${trans}.passwordResetedSuccessfully`, { password: value });
    //                 toastService.showToast({ variant: "success", message: success });
    //             } else {
    //                 toastService.showToast({ variant: "error", message: errors.map((e, i) => <div key={i}>{e}</div>) });
    //             }
    //         })
    //         .catch(error => {
    //             const errorMessage = this.state.translate(`${trans}.unexpectedError`);
    //             toastService.showToast({ variant: "error", message: errorMessage });
    //         });
    // };

    async loadPositions() {        
        const { data } = await positionService.list({ page: 1 });
        const positions = data["hydra:member"].map((e) => new ListItem(e["@id"], e.name));
        const item = (this.props.location.state && this.props.location.state.position) || null;
        const position = positions && positions.find((e) => e.label === item);
        this.setState({ positions, position });
    }

    async loadUsers() {
        const {
            pageNumber,
            filterCriteria: { username, lastName, contact, position, status, school },
        } = this.state;

        const filter = {
            username: username ? username : null,
            lastName: lastName ? lastName : null,
            "contact.value": contact ? contact : null,
            "positions.name": position ? position.label : null,
            "schoolPersonRoles.school.id": school ? school.value : null,
            status: status ? status.map((e) => e.value) : null,
        };

        const { data } = await userService.list({ page: pageNumber, ...filter });
        const items = data["hydra:member"];
        const total = data["hydra:totalItems"];

        this.setState({ items, total });
    }

    render() {
        const {
            items,
            total,
            pageSize,
            pageNumber,
            translate,
            openCreateDialog,
            openUpdateDialog,
            openDeleteDialog,
            // openChangePasswordDialog,
            user,
            // passwordChange,
            // selectedUser,
            genders,
            status,
            positions,
            position,
            contactTypes,
        } = this.state;

        const filterAttributes = {
            onFilterChange: this.handleFilter,
            positions: positions,
            position: position,
            // student ? new ListItem({label: this.state.school.title, value: this.state.school.id}),
            status: status,
            school: (this.state.school && new ListItem(this.state.school.id, this.state.school.title)) || null
        };

        return (
            <React.Fragment>
                {openCreateDialog && (
                    <UserAdd
                        user={user}
                        open={openCreateDialog}
                        onClose={this.toggleCreateDialog}
                        onCreate={this.handleCreateUser}
                        genders={genders}
                        positions={positions}
                        contactTypes={contactTypes}
                    />
                )}

                {openUpdateDialog && (
                    <UserEdit
                        user={user}
                        open={openUpdateDialog}
                        onClose={this.toggleUpdateDialog}
                        onUpdate={this.handleUpdateUser}
                        genders={genders}
                        positions={positions}
                        contactTypes={contactTypes}
                    />
                )}

                {openDeleteDialog && (
                    <DoranRemoveDialog
                        data={user}
                        open={openDeleteDialog}
                        onClose={this.toggleDeleteDialog}
                        onDelete={this.handleDeleteUser}
                        titleText={translate(`${trans}.remove.titleText`)}
                        contentText={translate(`${trans}.remove.contentText`)}
                        agreeText={translate(`${trans}.remove.agreeText`)}
                        disagreeText={translate(`${trans}.remove.disagreeText`)}
                    />
                )}

                {/* {openChangePasswordDialog && (
                    <UserChangePassword
                        data={passwordChange}
                        open={openChangePasswordDialog}
                        onClose={this.toggleChangePasswordDialog}
                    />
                )} */}

                <UserListHeader onCreateDialogToggle={this.toggleCreateDialog} />
                {position && <UserListFilter {...filterAttributes} />}
                {positions && !position && <UserListFilter {...filterAttributes} />}
                <UserList
                    items={items}
                    total={total}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onEdit={this.toggleUpdateDialog}
                    onDelete={this.toggleDeleteDialog}
                    onPageNumberChange={this.handlePageNumberChange}
                    onResetPassword={this.resetPassword}
                    status={status}
                    contactTypes={contactTypes}
                />
            </React.Fragment>
        );
    }
}

export default withTranslation("user")(Users);
