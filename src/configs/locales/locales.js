import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// locales
import faCommon from "../../assets/locales/fa/common.json";
import faInfrastructure from "../../assets/locales/fa/infrastructure.json";
import faFeatures from "../../assets/locales/fa/features.json";
import faCategory from "../../assets/locales/fa/features/category.json";
import faBanner from "../../assets/locales/fa/features/banner.json";
import faComment from "../../assets/locales/fa/features/comment.json";
import faRegion from "../../assets/locales/fa/features/region.json";
import faLesson from "../../assets/locales/fa/features/lesson.json";
import faRoom from "../../assets/locales/fa/features/room.json";
import faMosque from "../../assets/locales/fa/features/mosque.json";
import faEducationComplex from "../../assets/locales/fa/features/education-complex.json";
import faUser from "../../assets/locales/fa/features/user.json";
import faSchool from "../../assets/locales/fa/features/school.json";
import faPost from "../../assets/locales/fa/features/post.json";
import faHomeClass from "../../assets/locales/fa/features/home-class.json";
import faClassProgram from "../../assets/locales/fa/features/class-program.json";

// resources
const resources = {
    fa: {
        common: faCommon,
        features: faFeatures,
        infrastructure: faInfrastructure,
        category: faCategory,
        banner: faBanner,
        region: faRegion,
        lesson: faLesson,
        mosque: faMosque,
        educationComplex: faEducationComplex,
        user: faUser,
        school: faSchool,
        room: faRoom,
        post: faPost,
        comment: faComment,
        homeClass: faHomeClass,
        classProgram: faClassProgram
    }
};

// namespaces
const namespaces = [
    "common",
    "infrastructure",
    "features",
    "category",
    "banner",
    "region",
    "lesson",
    "mosque",
    "educationComplex",
    "user",
    "school",
    "room",
    "post",
    "comment",
    "homeClass",
    "classProgram"
];

i18n.use(detector)
    .use(initReactI18next)
    .init({
        ns: namespaces,
        resources: resources,
        defaultNS: "common",
        lng: "fa",
        fallbackLng: "fa",
        debug: false,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
