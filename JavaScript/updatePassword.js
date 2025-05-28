import { auth, updatePassword } from "../fireBase.js";


let myupdatePassword = document.getElementById("idUpdatePassword")

export let passwordReset = () => {
    const user = auth.currentUser;


    // check if user he ke nh
    if (!user) {
        swal("Error", "User not signed in.", "error");
        return;
    }


    // input open hu ga new password ke lie
    swal({
        title: "🔒 Enter New Password",
        text: "Password must be at least 6 characters",
        content: {
            element: "input",
            attributes: {
                placeholder: "New Password",
                type: "password",
            },
        },
        buttons: true,
    }).then((newPassword) => {
        if (!newPassword || "") {
            return;
        }
        if (newPassword.length < 6) {
            swal("Warning", "Password must be at least 6 characters.", "warning");
            return;
        }


        // password update hu ga
        updatePassword(user, newPassword).then(() => {
            swal("Success", "Password updated successfully!", "success");
        }).catch((error) => {
            swal("Error", error.message, "error");
        });
    }
    )
}


