import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

export default function Loading () {
    return (
        <div className='text-center' style={{ marginTop: '400px' }}>
            <h6>Updating</h6>
            <PulseLoader 
                size={75}
                color={"#51C878"}
                loading={true}
            />
        </div>
    );
}