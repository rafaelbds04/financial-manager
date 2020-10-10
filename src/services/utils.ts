import { showMessage } from "react-native-flash-message"

const catchErrorMessage = (message: string) => {
    showMessage({
        type: "danger",
        message: 'An error has occurred',
        description: message,
        duration: 5000
    })
}

export { catchErrorMessage }