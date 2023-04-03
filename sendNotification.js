'use strict'


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.sendNotification =
functions.firestore.document("users/{userID}/Notifications/{notificationId}")
.onWrite((change, context) => {
    const userID = context.params.userID;
    const notificationId = context.params.notificationId;
    console.log("BuyerID: "+userID);

return admin.firestore().collection("users").doc(userID).collection("Notifications").doc(notificationId).get().then(queryResult => {
    const notificationMessage = queryResult.data().notificationMessage;
    const notificationTitle = queryResult.data().notificationTitle;

    console.log("Title: "+notificationTitle);
    console.log("Message: "+notificationMessage);



   return admin.firestore().doc("users/" + userID).get().then(result => {
    		 console.log("getting token");
            const device_token = result.get('device_token');
    		 console.log("token: "+device_token);

            const notificationContent = {
                notification: {
                    title: notificationTitle,
                    body: notificationMessage,
                    icon: "default",
                    sound : "default"
                }
            };

        return admin.messaging().sendToDevice(device_token, notificationContent).then(result => {
        console.log("Notification sent!");
        console.log(response.results[0].error);
        return null;
            }).catch(function(error) {
                console.log("Error sending message:", error);
            });
        });
    })
});