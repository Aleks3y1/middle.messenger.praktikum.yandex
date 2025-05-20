import {Validation} from "./Validation.ts";

export function validationHook(form: HTMLFormElement): boolean {
    let isValid = true;
    form.querySelectorAll("input").forEach((el) => {
        const input = el as HTMLInputElement;

        if (input.name === "retryPassword") {
            const errEl = input.nextElementSibling as HTMLElement;
            input.classList.remove("input-error");
            if (errEl) errEl.textContent = "";
        }

        if (input.name === "retryPassword") {
            const pwdInput = form.querySelector("input[name='password']") as HTMLInputElement;
            const pwd = pwdInput ? pwdInput.value : "";
            if (input.value !== pwd) {
                isValid = false;
                input.classList.add("input-error");
                const err = input.nextElementSibling as HTMLElement;
                if (err) err.textContent = "Пароли не совпадают";
                return;
            }
        }

        if (!Validation.validate(input)) {
            isValid = false;
        }
    });
    return isValid;
}
