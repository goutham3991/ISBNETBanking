const required = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}. See .env.example`);
    }
    return value;
};

export const validUser = {
    get email() { return required('VALID_USER_EMAIL'); },
    get password() { return required('VALID_USER_PASSWORD'); },
    get username() { return required('VALID_USER_NAME'); }
};
