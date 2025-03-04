// 路由列表
import {createRouter, createWebHistory} from 'vue-router';
import Login from "../views/Login/Login.vue";
import Home from "../components/HomeComponents/Home.vue";
import HomePage from "../views/Moments/HomePage.vue";
import Email from "../views/Email/Email.vue";
import Profile from "../views/PersonalProfile/Profile.vue";
import More from "../views/More/EditProfile.vue";
import Test from "../views/Test.vue";
import MessageContacts from "../views/Messages/MessagesContacts.vue";
import EmailEdit from "../views/Email/EmailEdit.vue";
import EmailBox from "../views/Email/EmailBox.vue";
import EmailDefault from "../views/Email/EmailDefault.vue";
import EmailContent from "../views/Email/EmailContent.vue";
import MessageBox from "../views/Messages/MessageBox.vue";
import MessagesContent from "../views/Messages/MessagesContent.vue";
import MessagesContent_Per from "../views/Messages/MessagesContent_Per.vue";
import MessagesContent_Def from "../views/Messages/MessagesContent_Def.vue";
import MessagesContacts_Def from "../views/Messages/MessagesContacts_Def.vue";
import MessagesContacts_Per from "../views/Messages/MessagesContacts_Per.vue";
import AnonymityMoments from "../views/Moments/SquareMoments.vue";
import FollowingMoments from "../views/Moments/FollowingMoments.vue";
import DefaultMoments from "../views/Moments/DefaultMoments.vue";
import PersonalMoments from "../views/Moments/PersonalMoments.vue";
import FriendsMoments from "../views/Moments/FriendsMoments.vue";
import AdminHome from "../components/HomeComponents/AdminHome.vue";
import UserManage from "../adminViews/UserManage.vue";
import NoticeBoard from "../adminViews/NoticeBoard.vue";
import MomentsManage from "../adminViews/MomentsManage.vue";
import EditProfile from "../adminViews/EditProfile.vue";
import SearchMoments from "../views/Moments/SearchMoments.vue";
import IntimacyLines from "../components/HomeComponents/LeftSide/IntimacyLines.vue";
import RecommendUsers from "../components/HomeComponents/LeftSide/RecommendUsers.vue";

const router = createRouter({
    //      createWebHistory        history模式         ===>   http://localhost:5050/login
    history: createWebHistory(),
    // 路由列表
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/test',
            component: Test,
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/intimacy_lines',
            component: IntimacyLines,
        },
        {
            path: '/recommend_users',
            component: RecommendUsers,
        },
        {
            path: '/admin_home',
            component: AdminHome,
            meta: {requiresAuth: true, requiresAdmin: true},
            children: [
                {
                    path: "/users_manage",
                    component: UserManage
                },
                {
                    path: "/notice_board",
                    component: NoticeBoard
                },
                {
                    path: "/moments_manage",
                    component: MomentsManage
                },
                {
                    path: "/edit_profile",
                    component: EditProfile
                }
            ]
        },
        {
            path: "/home",
            component: Home,
            children: [
                {
                    path: "/homepage",
                    component: HomePage,
                    children: [
                        {
                            path: '/anonymity_moments',
                            component: AnonymityMoments
                        },
                        {
                            path: '/search_moments',
                            component: SearchMoments
                        },
                        {
                            path: '/following_moments',
                            component: FollowingMoments
                        },
                        {
                            path: '/default_moments',
                            component: DefaultMoments
                        },
                        {
                            path: "/personal_moments",
                            component: PersonalMoments,
                        },
                        {
                            path: "/friends_moments",
                            component: FriendsMoments,
                        },
                    ]
                },

                {
                    path: "/email",
                    component: Email,
                    children: [
                        {
                            path: "/email_edit",
                            component: EmailEdit
                        },
                        {
                            path: "/email_box",
                            component: EmailBox
                        },
                        {
                            path: "/email_default",
                            component: EmailDefault
                        },
                        {
                            path: "/email_content",
                            component: EmailContent
                        }
                    ]
                },
                {
                    path: "/profile",
                    component: Profile,
                },
                {
                    path: "/more",
                    component: More,
                },
                {
                    path: "/message_box",
                    component: MessageBox,
                    children: [
                        {
                            path: "/contact",
                            component: MessageContacts,
                            children: [
                                {
                                    path: '/contact_default',
                                    component: MessagesContacts_Def
                                },
                                {
                                    path: '/contact_info',
                                    name: '/contact_info',
                                    component: MessagesContacts_Per
                                },
                            ]
                        },
                        {
                            path: "/message",
                            component: MessagesContent,
                            children: [
                                {
                                    path: "/message_content",
                                    component: MessagesContent_Per
                                },
                                {
                                    path: "/message_default",
                                    component: MessagesContent_Def
                                },
                            ]
                        }
                    ]
                }

            ]
        },
    ]
});

router.beforeEach((to, from, next) => {

    if (to.path === '/login') {
        next();
        return;
    }
    const userType = localStorage.getItem('userType');
    if (userType === '普通用户') {
        if (to.path === '/users_manage') {
            next('/login');
        } else {
            next();
        }
    } else if (userType === '管理员') {
        if (to.path === '/default_moments' && to.matched.some(record => record.meta.requiresAuth)) {
            next('/users_manage');
        } else {
            next();
        }
    } else {
        next('/login');
    }
});
export default router;



