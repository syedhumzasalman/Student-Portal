import { auth, sendEmailVerification } from "../fireBase.js"




export let sendVerification = () => {
    const user = auth.currentUser;
    if (user.emailVerified) {
        swal("Info", "Your email is already verified.", "info");
    }

    else if (user) {
        sendEmailVerification(user)
            .then(() => {
                swal("Success!", "Verification email sent. Please check your inbox.", "success");
            })
            .catch((error) => {
                swal("Error!", error.message, "error");
            });
    }
}
