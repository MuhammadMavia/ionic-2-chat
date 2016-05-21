import {Injectable} from 'angular2/core';
@Injectable()
export class MyService {
    users:any;
    friends:any;
    requests:any;
    notifications:any;

    constructor() {

    }

    getRequestForMe() {
        this.requests = [];
        this.getFirebaseRef().child('requests').child(this.getCurrentUserData().uid).on('value', (request)=> {
            for (var key in request.val()) {
                this.getFirebaseRef().child('users').child(key).once("value", (user)=> {
                    var obj = request.val()[key];
                    obj.profile = user.val();
                    this.requests.push(obj);
                });
            }
        });
        return this.requests;
    }

    getMeFriends() {
        this.friends = [];
        this.getFirebaseRef().child('friends').child(this.getCurrentUserData().uid).on('value', (request)=> {
            for (var key in request.val()) {
                this.getFirebaseRef().child('users').child(key).once("value", (user)=> {
                    var obj = request.val()[key];
                    obj.profile = user.val();
                    this.friends.push(obj);
                });
            }
        });
        return this.friends;
    }

    getNotifications() {
        this.notifications = [];
        this.getFirebaseRef().child('notifications').child(this.getCurrentUserData().uid).on('value', (notification)=> {
            for (var key in notification.val()) {
                this.getFirebaseRef().child('users').child(key).once("value", (user)=> {
                    var obj = notification.val()[key];
                    obj.profile = user.val();
                    this.notifications.push(obj);
                });
            }
        });
        return this.notifications;
    }

    getFirebaseRef() {
        return new Firebase('https://ionic2chat.firebaseio.com/')
    }

    getAllUser() {
        this.users = [];
        this.getFirebaseRef().child('users').once("value", (user)=> {
            for (var key in user.val()) {
                this.users.push(user.val()[key]);
            }
        });
        return this.users;
    }

    getCurrentUserData() {
        return JSON.parse(localStorage.getItem('firebase:session::ionic2chat'))
    }

    getCurrentUserProfile() {
        return JSON.parse(localStorage.getItem('userProfile'))
    }

    sendRequest(reqUser) {
        this.getFirebaseRef().child('requests').child(reqUser.userID).child(this.getCurrentUserData().uid).set({
            userID: this.getCurrentUserData().uid,
            status: 0
        });
    }

    resToReq(res, request) {
        if (res) {
            var obj = {};
            obj.userID = this.getCurrentUserData().uid;
            obj.code = 1;
            obj.read = false;

            var multiPath = {};

            multiPath[`notifications/${request.profile.userID}/${obj.userID}`] = obj;
            multiPath[`friends/${this.getCurrentUserData().uid}/${request.profile.userID}`] = {status: 1};
            multiPath[`friends/${request.profile.userID}/${this.getCurrentUserData().uid}`] = {status: 1};
            multiPath[`requests/${this.getCurrentUserData().uid}/${request.profile.userID}`] = null;
            this.getFirebaseRef().update(multiPath);
            //this.getFirebaseRef().child("notifications").child(request.profile.userID).child(obj.userID).set(obj);
            //this.getFirebaseRef().child("friends").child(this.getCurrentUserData().uid).child(request.profile.userID).set({status: 1});
            //this.getFirebaseRef().child("friends").child(request.profile.userID).child(this.getCurrentUserData().uid).set({status: 1});
            //this.getFirebaseRef().child("requests").child(this.getCurrentUserData().uid).child(request.profile.userID).set(null);
        }
        else {
            this.getFirebaseRef().child("requests").child(this.getCurrentUserData().uid).child(request.profile.userID).set(null);
        }
    }
}