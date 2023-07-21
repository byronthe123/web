import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Lightbox from 'react-image-lightbox';

import {
    Input,
} from 'reactstrap';

import ItemCard from './ItemCard';
import styled from 'styled-components';
import { api, formatDatetime } from '../../../utils';
import { generateDamageReport } from './utils';
import { useAppContext } from '../../../context';

const View = ({
    user,
    dataStore,
    appendCreatedRecords
}) => {

    //Properties:
    const { appData: { stations } } = useAppContext();
    const userStation = stations.find(s => s.s_unit === user.s_unit);
    const [awbArray, setAwbArray] = useState([]);
    const [range, setRange] = useState('');
    const [searchString, setSearchString] = useState('');
    const [collection_id, set_collection_id] = useState(null);
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [lightBoxOpen, setLightBoxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [damageReportItem, setDamageReportItem] = useState(null);
    const [damageReportItemsArray, setDamageReportItemsArray] = useState([]);
    const [damageReport, setDamageReport] = useState('');
    const [dataSetIndex, setDataSetIndex] = useState(0);

    const [deepSearch, setDeepSearch] = useState('');
    const [deepSearchResults, setDeepSearchResults] = useState([]);
    const [deepSearched, setDeepSearched] = useState(false);

    //Methods:
    useEffect(() => {
        setAwbArray(dataStore);
        if (dataStore.length > 0) {
            const end = dataStore[0].time_submitted;
            const start = dataStore[dataStore.length - 1].time_submitted;
            setRange(`Displaying data from ${formatDatetime(start)} to ${formatDatetime(end)}.`);
        }
    }, [dataStore]);

    const clearSearch = () => {
        appendCreatedRecords(deepSearchResults);
        setSearchString('');
        setDeepSearch('');
        setDeepSearched(false);
        setDeepSearchResults([]);
    };

    useEffect(() => {
        const filterSearch = () => {
            if (searchString.length > 0) {
                const matches = dataStore.filter((awb) =>
                    awb.awb_uld.toLowerCase().includes(searchString.toLowerCase())
                );
                setAwbArray(matches);
            } else {
                setAwbArray(dataStore);
            }
        };
        filterSearch();
    }, [searchString, dataStore]);

    const setData = () => {
        setTitle(<h1>{damageReportItem.awb_uld}</h1>);

        const caption = (
            <div className="row" style={{ width: '100%' }}>
                {/* <h1>{dataItem.awb_uld}: {dataItem.comments} by {dataItem.full_name} at {moment(dataItem.time_submitted).format('MM/DD/YYYY HH:mm A')}</h1> */}
                <div className="col-12" style={{ width: '100%' }}>
                    <h1>
                        {damageReportItem.awb_uld}: {damageReportItem.comments}{' '}
                        by {damageReportItem.full_name} at{' '}
                        {moment(damageReportItem.time_submitted).format(
                            'MM/DD/YYYY HH:mm A'
                        )}
                    </h1>
                </div>
                <div className="col-6 bg-warning text-center">
                    <i
                        style={{ fontSize: '48px' }}
                        className="far fa-envelope visual-caption-icon"
                        onClick={() => generateDamageReport('email', user, userStation,  damageReportItem, damageReportItemsArray)}
                    ></i>
                </div>
                <div className="col-6 bg-secondary text-center">
                    <i
                        style={{ fontSize: '48px' }}
                        className="fas fa-cloud-download-alt visual-caption-icon"
                        onClick={() => generateDamageReport('print', user, userStation, damageReportItem, damageReportItemsArray)}
                    ></i>
                </div>
            </div>
        );

        setCaption(caption);
        setLightBoxOpen(true);
    };

    const getPhotos = async (collection_id) => {
        const response = await api('post', '/getVisualReportingItemsByCollection', {collection_id});
        const { data } = response;
        const dataItem = data[0];

        setDamageReportItem(dataItem);
        setDamageReportItemsArray(data);
        set_collection_id(collection_id);
        setImages(resolveImages(data));
        setDataSetIndex((dataSetIndex) => dataSetIndex + 1);
    };

    useEffect(() => {
        if (damageReportItem !== null) {
            setData();
        }
    }, [dataSetIndex]);

    const resolveImages = (items) => {
        const images = items.map((i) => i.file_link);
        return images;
    };

    const tryDeepSearch = async () => {
        const res = await api('get', `visualReportingDeepSearch/${deepSearch}`);
        setDeepSearchResults(res.data);
        setDeepSearched(true);
    };

    const noResults = awbArray.length < 1 && searchString.length > 0;
    const noDeepSearchResults =
        deepSearched && deepSearch.length > 0 && deepSearchResults.length === 0;
    const resultsOutput =
        noResults && deepSearch.length < 1
            ? 'No results'
            : noDeepSearchResults
            ? 'No Deep Search result'
            : null;

    //Return:
    return (
        <div>
            <SearchBars>
                <div>
                    <h4>{range}</h4>
                    <h6>Type AWB/ULD to Search:</h6>
                    <div className={'d-flex mb-2'}>
                        <CustomInput
                            type="text"
                            className="mr-2"
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                        <CustomIcon
                            className={`fas fa-redo ${searchString.length > 0 && 'text-success'}`}
                            onClick={() => clearSearch()}
                        />
                    </div>
                </div>
                {noResults && (
                    <DeepSearchContainer>
                        <h6>
                            Try a Deep Search for the{' '}
                            <span className={'font-weight-bold'}>exact</span>{' '}
                            AWB/ULD number:
                        </h6>
                        <div className={'d-flex mb-2'}>
                            <CustomInput
                                type="text"
                                className={"mr-2"}
                                value={deepSearch}
                                onChange={(e) => setDeepSearch(e.target.value)}
                            />
                            <CustomIcon
                                className={`fad fa-search ${deepSearch.length > 0 ? 'text-success' : 'custom-disabled'}`}
                                onClick={() => tryDeepSearch()}
                            />
                        </div>
                    </DeepSearchContainer>
                )}
            </SearchBars>
            {
                <>
                    <h1>{resultsOutput}</h1>
                    <div className="full-vh-height">
                        <CardsContainer>
                            {awbArray &&
                                awbArray.map((awb, i) => (
                                    <ItemCard
                                        key={i}
                                        awb={awb}
                                        getPhotos={getPhotos}
                                    />
                                ))}
                            {deepSearchResults.map((awb, i) => (
                                <ItemCard
                                    key={i}
                                    awb={awb}
                                    getPhotos={getPhotos}
                                />
                            ))}
                        </CardsContainer>
                    </div>
                </>
            }
            {lightBoxOpen && (
                <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={
                        images[(photoIndex + images.length - 1) % images.length]
                    }
                    onCloseRequest={() => setLightBoxOpen(false)}
                    onMovePrevRequest={() =>
                        setPhotoIndex(
                            (photoIndex + images.length - 1) % images.length
                        )
                    }
                    onMoveNextRequest={() =>
                        setPhotoIndex((photoIndex + 1) % images.length)
                    }
                    imageTitle={title}
                    imageCaption={caption}
                />
            )}
        </div>
    );
};

const SearchBars = styled.div`
    display: flex;
`;

const CustomIcon = styled.i`
    font-size: 24px;
    padding-top: 5px;

    &:hover {
        cursor: pointer;
    }
`;

const CustomInput = styled(Input)`
    width: 300px;
`;

const DeepSearchContainer = styled.div`
    border: 2px solid #38e860;
    border-radius: 20px;
    margin-left: 50px;
    padding: 3px 10px;
`;

const CardsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
    gap: 8px;
`;

export default View;
