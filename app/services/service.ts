import {Injectable} from 'angular2/core';
@Injectable()
export class MyService {
    users:any;
    friends:any;
    requests:any;
    notifications:any;
    conversations:any;

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

    getConversations() {
        this.conversations = [];
        this.getFirebaseRef().child('my_conversations').child(this.getCurrentUserData().uid).on('value', (myConversation)=> {
            for (var key in myConversation.val()) {
                console.log(key);
                this.getFirebaseRef().child('conversations').child(key).once("value", (conversation)=> {
                    var obj = conversation.val();
                    let r = obj.users.indexOf(this.getCurrentUserData().uid);
                    r ? r = 0 : r = 1;
                    this.getFirebaseRef().child('users').child(obj.users[r]).once('value', (user)=> {
                        obj.profile = user.val();
                        obj.conversationID = key;
                        this.conversations.push(obj);
                        console.log(this.conversations)
                    });
                });
            }
        });
        return this.conversations;
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

    getChat() {

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
            var conversationKey = this.getFirebaseRef().child('conversations').push({
                users: [request.profile.userID, this.getCurrentUserData().uid],
                createdOn: Firebase.ServerValue.TIMESTAMP
            }, (err, data)=> {
                if (!err) {
                    this.getFirebaseRef().child('my_conversations').child(request.profile.userID).child(conversationKey.key()).set(true);
                    this.getFirebaseRef().child('my_conversations').child(this.getCurrentUserData().uid).child(conversationKey.key()).set(true);
                }
            });
        }
        else {
            this.getFirebaseRef().child("requests").child(this.getCurrentUserData().uid).child(request.profile.userID).set(null);
        }
    }

    sendMsg(msg, user) {
        var newMsg = {};
        newMsg.to = this.getCurrentUserData().uid;
        newMsg.code = 1;
        newMsg.from = user.profile.userID;
        newMsg.time = Firebase.ServerValue.TIMESTAMP;
        newMsg.read = false;
        newMsg.text = msg;
        console.log(msg, user);
        this.getFirebaseRef().child('messages').child(user.conversationID).push(newMsg)
    }
}