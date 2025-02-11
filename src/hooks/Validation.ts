export class Validation {
    private static patterns: Record<string, RegExp> = {
        first_name: /^[A-ZА-Я][a-zа-я-]*$/,
        second_name: /^[A-ZА-Я][a-zа-я-]*$/,
        login: /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
        phone: /^\+?\d{10,15}$/,
        message: /.+/
    };

    private static errorMessages: Record<string, string> = {
        first_name: "Обязательно с заглавной буквы",
        second_name: "Обязательно с заглавной буквы",
        login: "От 3 до 20 символов",
        email: "Некорректный email",
        password: "8-40 символов",
        phone: "От 10 до 15 цифр",
        message: "Не должно быть пустым"
    };

    public static validate(field: HTMLInputElement): boolean {
        const {name, value} = field;
        const pattern: RegExp = this.patterns[name];

        if (!pattern) return true;

        const isValid: boolean = pattern.test(value.trim());
        const errorElement = field.nextElementSibling as HTMLElement;

        if (!isValid) {
            field.classList.add("input-error");
            if (errorElement) errorElement.textContent = this.errorMessages[name];
        } else {
            field.classList.remove("input-error");
            if (errorElement) errorElement.textContent = "";
        }

        return isValid;
    }
}
