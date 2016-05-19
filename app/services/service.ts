import {Injectable} from 'angular2/core';
@Injectable()
export class MyService {
    users:any;
    requests:any;

    constructor() {
        this.getCurrentUserProfile();
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
        this.getFirebaseRef().child('users').child(this.getCurrentUserData().uid).on("value", (user)=> {
            console.log(user.val());
            return user.val();
        });
    }

    sendRequest(reqUser) {
        this.getFirebaseRef().child('requests').child(reqUser.userID).child(this.getCurrentUserData().uid).set({
            userID: this.getCurrentUserData().uid,
            status: 0
        });
    }

    resToReq(res, request) {
        if (res) {
            var a = this.getCurrentUserProfile();
            console.log(request);
            console.log(a);
            var obj = {};
            this.getFirebaseRef().child("notifications").child(request.profile.userID).set(a);
            //this.getFirebaseRef().child("requests").child(this.getCurrentUserData().uid).child(request.profile.userID).set(null);
        }
        else {
            this.getFirebaseRef().child("requests").child(this.getCurrentUserData().uid).child(request.profile.userID).set(null);
        }
    }
}