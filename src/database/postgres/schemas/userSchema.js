import {
    number as yupNumber,
    object as yupObject,
    string as yupString,
    ValidationError,
} from 'yup';

const userSchema = yupObject().shape({
    name: yupString().required().max(30).default('').trim(),
    email: yupString().required().email().lowercase().trim(),
});

export default userSchema;
