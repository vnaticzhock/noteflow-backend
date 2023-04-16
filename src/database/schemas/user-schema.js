import yup from 'yup';
import validator from 'validator';
import timeStampSchema from './time-stamp-schema.js';

const userSchema = yup
    .object()
    .shape({
        id: yup.string().test({
            name: 'id',
            message: '${path} must be uuid', // eslint-disable-line
            test: (value) => (value ? validator.isUUID(value) : true),
        }),

        email: yup.string().required().email().lowercase().trim(),

        password: yup.string().when('$validatePassword', {
            is: true,
            then: yup.string().required().min(8).max(30),
        }),

        name: yup.string().required().max(30).default('').trim(),
    })
    .noUnknown()
    .concat(timeStampSchema);

export default userSchema;
