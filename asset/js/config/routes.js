/**
 * asset/js/config/routes.js
 * */
import Home from "../pages/Home/Home.js";
import FieldComment from "../pages/FieldComment/FieldComment.js";
import GenGetterSetter from "../pages/GenGetterSetter/GenGetterSetter.js";
import CSVEditor from "../pages/CSVEditor/_CSVEditor.js";

const routes = {
    Home: {
        title: 'Home',
        component: Home,
    },
    FieldComment: {
        title: 'Field Comment',
        component: FieldComment,
    },
    GenGetterSetter: {
        title: 'Getter / Setter Generator',
        component: GenGetterSetter,
    },
    CSVEditor: {
        title: 'CSV Editor',
        component: CSVEditor,
    },
};

export default routes;