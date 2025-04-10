const inputText = document.getElementById("todo-input");
const errorMsg = document.getElementById("error-input");

export const validate = () => {
    if (inputText.validity.valid) {
        errorMsg.innerHTML = "";
        return true;
    } else {
        if (inputText.validity.valueMissing) {
            errorMsg.innerHTML = "Ce champ est obligatoire";
            return false;
        } else {
            if (inputText.validity.tooShort) {
                errorMsg.innerHTML = "Veuillez entrer au moins 5 caractères";
                return false;
            }
        }
    }
};
