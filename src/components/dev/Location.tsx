import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';
import HaversineGeolocation from 'haversine-geolocation';
import TestWindow from './TestWindow';

interface LocationPoint {
    latitude: number,
    longitude: number,
    accuracy?: number
}

export default function Location () {
    const ewrPoint: LocationPoint = {
        latitude: 40.705777621057074,
        longitude: -74.16394529264974
    }

    const [currentPoint, setCurrentPoint] = useState<LocationPoint>({
        latitude: 0,
        longitude: 0,
        accuracy: 0
    });

    const [locationParsed, setLocationParsed] = useState(false);

    const [distance, setDistance] = useState<number>(0);

    useEffect(() => {
        const getLocation = async() => {
            const data = await HaversineGeolocation.isGeolocationAvailable();
            const _currentPoint = {
                latitude: data.coords.latitude,
                longitude: data.coords.longitude,
                accuracy: data.coords.accuracy
            };
    
            const _distance = HaversineGeolocation.getDistanceBetween(ewrPoint, _currentPoint, 'mi');
            setDistance(_distance);
    
            setCurrentPoint(_currentPoint);
            setLocationParsed(true);
        }
        getLocation();
    }, []);


    // New Window:
    const [windowOpen, setWindowOpen] = useState(false);
    const [name, setName] = useState('');

    return (
        <Row>
            <Col md={12}>
                <h3>EWR: {ewrPoint.latitude}, {ewrPoint.longitude}</h3>
                {
                    !locationParsed ? 
                        <>
                            <h3 className={'text-danger'}>
                                Your location has not been parsed
                            </h3>
                        </>
                         :
                        <>
                            <h3>
                                Your Location: latitude {currentPoint.latitude}, longitude: {currentPoint.longitude}
                            </h3>
                            <h3>Your Distance to EWR is: {distance} miles</h3>
                        </>
                }
                <h1 className={'mt-5'}>Current Variable Value: {name}</h1>
                <Button onClick={() => setWindowOpen(true)} className={'d-block'}>Open Window</Button>
                {
                    windowOpen && 
                    <TestWindow 
                        name={name}
                        setName={setName}
                        setWindowOpen={setWindowOpen}
                    />
                }
            </Col>
        </Row>
    );
}
