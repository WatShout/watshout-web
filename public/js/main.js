
// This file contains helper functions for the main maps page
// I didn't want to have this and the maps be crowding the same file

// I am just testing git branches   

let userID;
let email;

firebase.auth().onAuthStateChanged(function(user) {

    if (user) {

        userID = user.uid;
        email = user.email;

        ref.child(`users`).child(userID).once('value', function(snapshot) {

            // User in database
            if (snapshot.exists()) {

                ref.child(`users`).child(user.uid).update({
                    "new": false
                });

            } else {

                let name = prompt("Enter your name");
                let age = prompt("Enter your age");

                ref.child(`users`).child(user.uid).update({
                    "name": name,
                    "age": parseInt(age),
                    "new": false,
                    "email": user.email
                });
            }

        });

    initMap();

    document.getElementById(`hello`).innerHTML = `Hello, ` +
    user.email + ` (` + user.uid + `)`;

    } else {
        console.log('logged out');
        window.location.replace(`/login`);
    }

    ref.child(`friends`).child(userID).on(`value`, function(snapshot) {

        snapshot.forEach(function(child){

            var key = child.key;
            var value = child.val();
            var recent = Object.keys(snapshot.val())[0];

            ref.child('users').child(key).child(`email`).on('value', function(snapshot) {

                // Users are friends already
                if (value && snapshot.exists()){

                    document.getElementById(`accepted`).innerHTML += snapshot.val();

                }

                // Users aren't friends yet
                else if(!value && snapshot.exists()){

                    var recent = Object.keys(snapshot.val())[0];

                    console.log(snapshot.val() + recent);

                    let htmlLink = `<a id="friend` + key + `"onclick=confirmFriend("` + key + `") href="#">` + snapshot.val() + `</a>`;

                    document.getElementById(`pending`).innerHTML += htmlLink;

                }
            });
        });
    });
});

let searchByEmail = (query) => {

    ref.child('users').orderByChild('email').equalTo(query).once('value', function(snapshot) {

        if(snapshot.exists()){
            let key = Object.keys(snapshot.val())[0];

            ref.child(`friends`).child(key).child(userID).set(false);

        } else {
            console.log("Invalid email");
        }

    });
};

let searchByID = (theirID) => {
    ref.child('users').child(theirID).child(`email`).once('value', function(snapshot) {

        if(snapshot.exists()){

            return snapshot.val();

        } else {
            return "test";
        }

    });
};

let askFriend = () => {

    let friendEmail = document.getElementById(`friend`).value;
    searchByEmail(friendEmail);

}

let confirmFriend = (friendID) => {
    ref.child(`friends`).child(userID).child(friendID).set(true);
    ref.child(`friends`).child(friendID).child(userID).set(true);

    let element = document.getElementById(`friend` + friendID);
    element.parentNode.removeChild(element);
}

let deleteMessages = () => {

    mapRef.remove();

};
