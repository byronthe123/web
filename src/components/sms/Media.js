import React from 'react';
import FileBase64 from 'react-file-base64';

const Media = ({getFiles, fileInputKey, id, updateComments}) => {
    return (
        <div>
            <FileBase64
                multiple={false}
                onDone={(e) => getFiles(e, id)} 
                key={fileInputKey}
            />
            <br></br>
            <h3 className='mt-2'>Comments:</h3>
            <textarea onChange={(e) => updateComments(e, id)} style={{width: '100%'}} className='mt-0'></textarea>
        </div>
    )
}

export default Media;