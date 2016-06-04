import {Injectable} from 'angular2/core';
import {LocalNotifications} from 'ionic-native';
import {Loading,Alert} from 'ionic-angular';

@Injectable()
export class MyService {
    users:any;
    friends:any;
    friendIDs:any;
    requests:any;
    requestIDs:any;
    messages:any;
    notifications:any;
    conversations:any;

    constructor() {

    }

    presentLoading() {
        let loading = Loading.create({
            content: "Please wait...",
        });
        return loading;
    }

    presentAlert(title,subTitle,btn) {
        return Alert.create({
            title: title,
            subTitle: subTitle,
            buttons: [btn]
        });
    }

    localNotificationShow(msg) {
        LocalNotifications.schedule({
            id: 1,
            text: msg,
            icon: 'http://a2.mzstatic.com/us/r30/Purple6/v4/45/99/be/4599beb5-9f5b-820b-c0b4-7936727f6949/icon256.png',
            data: {secret: "dhhd"}
        });

    }

    getRequestForMe() {
        this.requests = [];
        this.getFirebaseRef().child('requests').child(this.getCurrentUserData().uid).on('child_added', (request)=> {
            //for (var key in request.val()) {
            this.getFirebaseRef().child('users').child(request.key()).once("value", (user)=> {
                var obj = request.val();
                obj.profile = user.val();
                this.requests.push(obj);
            });
            //}
        });
        this.getFirebaseRef().child('requests').child(this.getCurrentUserData().uid).on('child_removed', (request)=> {
            this.requests.forEach((val, i)=> {
                val.userID == request.val().userID ? this.requests.splice(i, 1) : null
            })

        });
        return this.requests;
    }

    getRequestIDs() {
        this.requestIDs = [];
        this.getFirebaseRef().child('requests').child(this.getCurrentUserData().uid).on('child_added', (request)=> {
            this.requestIDs.push(request.key());
        });
        return this.requestIDs;
    }

    getMeFriends() {
        this.friends = [];
        this.getFirebaseRef().child('friends').child(this.getCurrentUserData().uid).on('child_added', (request)=> {
            this.getFirebaseRef().child('users').child(request.key()).once("value", (user)=> {
                var obj = request.val();
                obj.profile = user.val();
                this.friends.push(obj);
            });
        });
        return this.friends;
    }

    getMyFriendIDs() {
        this.friendIDs = [];
        this.getFirebaseRef().child('friends').child(this.getCurrentUserData().uid).on('child_added', (request)=> {
            this.friendIDs.push(request.key());
        });
        return this.friendIDs;
    }


    getNotifications() {
        this.notifications = [];
        this.getFirebaseRef().child('notifications').child(this.getCurrentUserData().uid).on('child_added', (notification)=> {
            //for (var key in notification.val()) {
            this.getFirebaseRef().child('users').child(notification.key()).once("value", (user)=> {
                var obj = notification.val();
                obj.profile = user.val();
                this.notifications.push(obj);
            });
            //}
        });
        return this.notifications;
    }

    getConversations() {
        this.conversations = [];
        this.getFirebaseRef().child('my_conversations').child(this.getCurrentUserData().uid).on('child_added', (myConversation)=> {
            this.getFirebaseRef().child('conversations').child(myConversation.key()).on('child_changed', (changeData)=> {
                var newData = changeData.val();
                if (newData.from == this.getCurrentUserData().uid) {
                    //this.getFirebaseRef().child('conversations').child(myConversation.key()).child('lastMsg').child('read').set(true);
                    this.localNotificationShow(newData.from);
                }
                this.conversations.forEach((val, index)=> {
                    if (val.conversationID == newData.conversationID) {
                        this.conversations[index].lastMsg = newData;
                    }
                });
                console.log(newData);
                console.log(this.conversations);
            });

            this.getFirebaseRef().child('conversations').child(myConversation.key()).once("value", (conversation)=> {
                var obj = conversation.val();
                let r = obj.users.indexOf(this.getCurrentUserData().uid);
                r ? r = 0 : r = 1;
                this.getFirebaseRef().child('users').child(obj.users[r]).once('value', (user)=> {
                    obj.profile = user.val();
                    obj.conversationID = conversation.key();
                    this.conversations.push(obj);
                });
            });
        });
        return this.conversations;
    }

    getFirebaseRef() {
        return new Firebase('https://ionic2chat.firebaseio.com/')
    }

    getAllUser() {
        this.users = [];
        this.getFirebaseRef().child('users').on("child_added", (user)=> {
            //for (var key in user.val()) {
            this.users.push(user.val());
            //}
            console.log(this.users);
        });
        return this.users;
    }

    getChat(conversationID, conversation) {
        this.getFirebaseRef().child('messages').child(conversationID).off("child_added");
        this.messages = [];
        if (conversation.lastMsg.from == this.getCurrentUserData().uid) {
            this.getFirebaseRef().child('conversations').child(conversationID).child('lastMsg').child('read').set(true);
        }
        this.getFirebaseRef().child('messages').child(conversationID).on("child_added", (msg)=> {
            //this.messages = [];
            this.messages.push(msg.val());
            /* for (var key in msg.val()) {
             this.messages.push(msg.val()[key]);
             }*/
            //location.assign('#bottom');
            //console.log(this.messages);
        });
        return this.messages
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
            var obj:any = {};
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
                createdOn: Firebase.ServerValue.TIMESTAMP,
                lastMsg: {
                    text: false,
                    time: Date.now(),
                    from: false,
                    read: false,
                    code: false,
                    to: false
                }
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
        let newMsg:any = {};
        newMsg.to = this.getCurrentUserData().uid;
        newMsg.code = 1;
        newMsg.from = user.profile.userID;
        newMsg.time = Firebase.ServerValue.TIMESTAMP;
        newMsg.read = false;
        newMsg.text = msg;
        newMsg.conversationID = user.conversationID;
        //console.log(msg, user);
        this.getFirebaseRef().child('messages').child(user.conversationID).push(newMsg);
        this.getFirebaseRef().child('conversations').child(user.conversationID).child('lastMsg').set(newMsg);
    }
}