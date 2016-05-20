import {Page,NavController} from 'ionic-angular';
import {SignUp} from '../signup/signup';
import {Login} from '../login/login';
import {MyService} from '../../services/service';

@Page({
    templateUrl: 'build/pages/menu/menu.html'
})
export class Menu {
    ref:any;
    tab:any;
    friends:any;
    userData:any;
    allUsers:any;
    requests:any;
    notifications:any;

    constructor(public nav:NavController, public myService:MyService) {
        this.tab = '0';
        this.ref = myService.getFirebaseRef();
        this.friends = myService.getMeFriends();
        this.allUsers = myService.getAllUser();
        this.requests = myService.getRequestForMe();
        this.userData = myService.getCurrentUserData();
        this.notifications = myService.getNotifications();
    }

    sendRequest(reqUser) {
        this.myService.sendRequest(reqUser);
    }

    resToReq(res, request) {
        this.myService.resToReq(res, request)
    }

    doLogout() {
        localStorage.removeItem('firebase:session::ionic2chat');
        localStorage.removeItem('userProfile');
        this.nav.push(Login)
    }


}