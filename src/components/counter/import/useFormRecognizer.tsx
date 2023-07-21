import { useState } from 'react';
import { api, asyncHandler} from '../../../utils';
import useLoading from '../../../customHooks/useLoading';
import _ from 'lodash';

export default function useFormRecognizer () {
    const { setLoading } = useLoading();
    const [formQuery, setFormQuery] = useState<boolean>(false);
    const [formFields, setFormFields] = useState({});

    const saveAndRecognizeForm = asyncHandler(async(file: object, modelId: string) => {
        setLoading(true);
        const data = {
            file,
            modelId
        }

        const res = await api('post', 'saveAndRecognizeForm', { data });

        setLoading(false);
        setFormQuery(true);

        if (res.status === 200) {
            const fields = _.get(res, 'data[0].fields', null);
            for (let key in fields) {
                fields[key].confirmed = false;
            }
            setFormFields(fields);
        }
    });

    return {
        formQuery,
        formFields,
        setFormFields,
        saveAndRecognizeForm
    }

}