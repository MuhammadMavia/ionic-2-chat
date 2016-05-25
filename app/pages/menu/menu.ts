import {Page,NavController} from 'ionic-angular';
import {SignUp} from '../signup/signup';
import {Login} from '../login/login';
import {Chat} from '../chat/chat';
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
    conversations:any;

    constructor(public nav:NavController, public myService:MyService) {
        this.tab = '0';
        this.ref = myService.getFirebaseRef();
        this.friends = myService.getMeFriends();
        this.allUsers = myService.getAllUser();
        this.requests = myService.getRequestForMe();
        this.userData = myService.getCurrentUserData();
        this.notifications = myService.getNotifications();
        this.conversations = myService.getConversations();
    }

    sendRequest(reqUser) {
        this.myService.sendRequest(reqUser);
    }

    resToReq(res, request) {
        this.myService.resToReq(res, request)
    }

    goToChat(friend) {
        console.log(friend);
        if (friend.conversationID) {
            this.nav.push(Chat, friend);

        }
        else {
            /*this.myService.getFirebaseRef().child('my_conversations').child(friend.profile.userID).on('value', (conversation)=> {
             for (var key in conversation.val()) {
             console.log(key);
             console.log(this.conversations);
             this.conversations.forEach((val)=> {
             if (val.conversationID == key) {
             console.log(key, 'Matched');
             break;
             }
             })
             }
             });*/
            console.log(friend.profile)
        }

    }

    doLogout() {
        localStorage.removeItem('firebase:session::ionic2chat');
        localStorage.removeItem('userProfile');
        this.nav.push(Login)
    }


}