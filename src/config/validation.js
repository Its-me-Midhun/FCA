/* eslint-disable no-useless-escape */
export const MISSING_NUMBER_CHARACTER = password => (/^(?=.*\d)/i.test(password) ? true : "Password must contain at least one number.");

export const MISSING_LOWERCASE_CHARACTER = password =>
    /^(?=.*[a-z])/i.test(password) ? true : "Password must contain at least one lowercase character.";

export const ONLY_NUMBER = resource => `${resource} should only contain numbers.`;

export const MISSING_UPPERCASE_CHARACTER = password =>
    /^(?=.*[A-Z])/i.test(password) ? true : "Password must contain at least one uppercase character.";

export const MISSING_SPECIAL_CHARACTER = password => (/^(?=.*\d)/i.test(password) ? true : "Password must contain at least one special character.");

export const REQUIRED = (resource, name) => (!resource ? `*${name} is required.` : true);

export const INVALID = resource => `${resource} is invalid.`;

export const LENGTH_REQUIRED = (resource, options) => {
    const { min, max } = options;
    if (min && max) {
        return `${resource} should be of length ${min} characters .`;
    }
    if (min) {
        return `${resource} must be more than ${min} characters.`;
    }
    return `${resource} must have  ${max} characters.`;
};

export const LETTER_ONLY = (value, name) => (/^[a-z][a-z\s]*$/i.test(value) ? true : `Invalid ${name}`);

export const NUMBER_ONLY = (value, name) => (/^[0-9]+$/i.test(value) ? true : `Invalid ${name}`);

export const EMAIL = (value, name) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i.test(value) ? true : false);

export const VALID_EMAIL = (value, name) =>
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
    )
        ? true
        : `Invalid ${name}`;

export const PASSWORD = value =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(value)
        ? true
        : `*Password must contain at least one number,one special character,one upper & lower case character with a minimum length of eight`;

export const SSN = (value, name) => (/^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/i.test(value) ? true : `Invalid ${name}`);

export const ZIP_CODE = (value, name) => (/^\d{5}$|^\d{5}-\d{4}$/i.test(value) ? true : `Invalid ${name}`);

export const PHONE_NO = (value, name) => (/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/i.test(value) ? true : `Invalid ${name}`);
