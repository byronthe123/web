import { renderToString } from 'react-dom/server';
import { api } from '../../../utils';
import GenerateDamageReport from './GenerateDamageReport';
import pica from 'pica';
import imageCompression from 'browser-image-compression';

async function compressImageFromUrl(url) {
    // Fetch the image data from the URL
    const response = await fetch(url);

    // Convert the fetched data to a Blob
    const imgBlob = await response.blob();

    const options = {
        maxSizeMB: 1, // (default: Number.POSITIVE_INFINITY)
        maxWidthOrHeight: 1920, // (default: undefined)
        useWebWorker: true, // (default: true)
        maxIteration: 10, // (default: 10)
    };

    try {
        // Pass the Blob to the imageCompression function
        const compressedFile = await imageCompression(imgBlob, options);
        // This will return a Blob object which is smaller in size.
        return compressedFile;
    } catch (error) {
        console.log(error);
    }
}

export const generateDamageReport = async (
    type,
    user,
    userStation,
    damageReportItem,
    damageReportItemsArray
) => {

    for (const item of damageReportItemsArray) {
        const blob = await compressImageFromUrl(item.file_link);
        item.reducedUrl = URL.createObjectURL(blob);
    }

    const damageReportPrint = renderToString(
        <GenerateDamageReport
            userStation={userStation}
            damageReportItem={damageReportItem}
            damageReportItemsArray={damageReportItemsArray}
        />
    );

    if (type === 'print') {
        const myWindow = window.open('', 'MsgWindow', 'width=1920,height=1080');
        myWindow.document.write(damageReportPrint);
    } else {
        emailDamageReport(user, damageReportItem);
    }
};

export const emailDamageReport = async (user, damageReportItem) => {
    const { collection_id } = damageReportItem;

    const data = {
        collection_id,
        userEmail: user.s_email,
    };

    await api('post', 'emailVisualReport', { data });
    alert('You will receive an email');
};
