import React from "react";
import { Switch } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Users from "../../../features/user/users/users";
import UserProfile from "../../../features/user/profile/user-profile";
import Posts from "../../../features/post/posts/posts";
import Comments from "../../../features/comment/comments/comments";
import Banners from "../../../features/banner/banners/banners";
import Regions from "../../../features/region/regions/regions";
import Categories from "../../../features/category/categories/categories";
import Schools from "../../../features/school/schools/schools";
import Lessons from "../../../features/lesson/lessons/lessons";
import Rooms from "../../../features/room/rooms/rooms";
import Mosques from "../../../features/mosque/mosques/mosques";
import EducationComplexes from "../../../features/education-complex/education-complexes/education-complexes";
import Home from "../../../features/home/home";
import NotFound from "../../not-found/not-found";
import ProtectedRoute from "../../../shared/routes/protected-route";

function Body() {
    return (
        <Switch>
            <ProtectedRoute exact path="/users" component={Users} />
            <ProtectedRoute exact path="/users/:name" component={UserProfile} />
            <ProtectedRoute exact path="/posts" component={Posts} />
            <ProtectedRoute exact path="/comments" component={Comments} />
            <ProtectedRoute exact path="/schools" component={Schools} />
            <ProtectedRoute exact path="/schools/:id/lessons" component={Lessons} />
            <ProtectedRoute exact path="/schools/:id/rooms" component={Rooms} />
            <ProtectedRoute exact path="/banners" component={Banners} />
            <ProtectedRoute exact path="/regions" component={Regions} />
            <ProtectedRoute exact path="/categories" component={Categories} />
            <ProtectedRoute exact path="/education-complexes" component={EducationComplexes} />
            <ProtectedRoute exact path="/mosques" component={Mosques} />
            <ProtectedRoute exact path="/mosques" component={Mosques} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute path="/**" component={NotFound} />
        </Switch>
    );
}

export default withTranslation("infrastracture")(Body);
