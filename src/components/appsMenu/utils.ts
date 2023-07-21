import * as yup from 'yup';
import { validateUrl } from '../../utils';

const fileSchema = yup.object().shape({
    base64: yup.string().required(),
    type: yup.string().required()
});

const base = yup.object().shape({
    title: yup.string().required(),
    link: yup.string().url().required(),
    file: yup.object().nullable().when(['type', 'logoUrl'], {
        is: (type: string, logoUrl: string) => {
            if (type === 'USER') {
                return false; // skip then
            } else if (logoUrl && validateUrl(logoUrl)) {
                return false;
            } else {
                return true;
            }
        },
        then: fileSchema.required()
    }),
    logoUrl: yup.string().notRequired().nullable(),
    indexNum: yup.number().required(),
    type: yup.string().required().test('Type', 'Must be SYSTEM or USER', (value: string) => {
        return ['SYSTEM', 'USER'].includes(value)
    }),
    modifiedBy: yup.string().email().required(),
    modifiedAt: yup.date().required()
});

export const createSchema = base.shape({
    createdBy: yup.string().email().required(),
    createdAt: yup.date().required()
});

export const updateSchema = base.shape({
    id: yup.number().required()
});