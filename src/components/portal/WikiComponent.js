import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/index';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {Button, Row, Col, Label, Input} from 'reactstrap';
import classnames from 'classnames';
import { asyncHandler } from '../../utils';
import ModalSearchWiki from './ModalSearchWiki';
import moment from 'moment';
import { api } from '../../utils';
import { useHistory } from 'react-router-dom';

export default function WikiComponent ({
    user,
    wikiTitle,
    wikiId,
    edit
}) {

    const history = useHistory();
    const [selectedWiki, setSelectedWiki] = useState({});
    const [tags, setTags] = useState([]);
    const [modalSearchOpen, setModalSearchOpen] = useState(false);

    const { wiki } = useContext(AppContext);
    const {
        wikis,
        setWikis,
        accessLevels,
        setAccessLevels
    } = wiki;

    useEffect(() => {
        const getWikis = asyncHandler(async() => {
            const queryParams = new URLSearchParams(window.location.search);
            const idParam = queryParams.get('id');
            const useWikiId = idParam || wikiId;
            const res = await api('get', `wiki/getWikis/${user.i_access_level}`);

            setWikis(res.data.wikis);
            setAccessLevels(res.data.accessLevels);

            console.log(`wikiTitle = ${wikiTitle}; wikiId = ${wikiId}`);

            if (useWikiId && !isNaN(parseInt(useWikiId))) {
                const redirectWiki = res.data.wikis.find(w => w.id === parseInt(useWikiId));
                if (redirectWiki) {
                    setSelectedWiki(redirectWiki);
                }
            } else if ((useWikiId === undefined || useWikiId === null) && wikiTitle && wikiTitle.length > 0) {
                const titledWiki = res.data.wikis.find(w => w.s_title.toUpperCase() === wikiTitle.toUpperCase());
                if (titledWiki) {
                    setSelectedWiki(titledWiki);
                }
            } else {
                goToHomeWiki(res.data.wikis);
            }

        });
        if (user) {
            getWikis();
        }
    }, [user, wikiTitle, wikiId, window.location.search]);

    useEffect(() => {
        if (selectedWiki && selectedWiki.s_tags) {
            const tags = selectedWiki.s_tags.split('•');
            setTags(tags);
        } else {
            setTags([]);
        }
    }, [selectedWiki]);

    const handleSelectWiki = (wiki) => {
        setSelectedWiki(wiki);
        setModalSearchOpen(false);
    }

    const goToHomeWiki = (data) => {
        const homeWiki = data.find(w => w.s_title === 'PORTAL/WIKI');
        setSelectedWiki(homeWiki);
    }
    
    const contentClickHandler = (e) => {
        const targetLink = e.target.closest('a');
        if(!targetLink) return;
        e.preventDefault();
        if (e.target.href.includes('https://eos.choice.aero')) {
            const path = e.target.href.replace('https://eos.choice.aero', '');
            history.push(path);
        } else {
            window.open(e.target.href, '_blank');
        }
    };

    return (
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={12}>
                        <div className={'float-right'}>
                            {
                                edit && user.b_internal && selectedWiki && 
                                <NavLink to={`/EOS/Portal/ManageWiki?editId=${selectedWiki.id}`}>
                                    <Button className={'d-inline mr-1'} color={'info'}>Edit</Button>
                                </NavLink>
                            }
                            <Button className={'d-inline mr-1'} onClick={() => goToHomeWiki(wikis)}>Home</Button>
                            <Button className={'d-inline'} onClick={() => setModalSearchOpen(true)}>Search</Button>
                        </div>
                    </Col>
                </Row>
                {
                    selectedWiki && selectedWiki.id ?
                        <Row>
                            <style jsx>
                                {
                                    `
                                        table, th, td {
                                            border: 1px solid black;
                                        }
                                    `
                                } 
                            </style>
                            <Col md={12}>
                            {
                                selectedWiki !== undefined && 
                                <div onClick={contentClickHandler} dangerouslySetInnerHTML={{__html: selectedWiki.s_wiki}}></div>
                            }
                            </Col>
                            <Col md={12}>
                                <Label className={'d-inline mr-2'}>Tags:</Label>
                                {
                                    tags && tags.length > 0 && tags.map((t, i) => (
                                        <button 
                                            className={'default btn btn-info d-inline mr-2'} 
                                            key={i}
                                        >
                                            {t}
                                        </button>
                                    ))
                                }
                            </Col>
                            <Col md={12} className={'mt-2'}>
                                Last modified by: {selectedWiki.s_modified_by} at {moment.utc(selectedWiki.t_modified).format('MM/DD/YYYY HH:mm:ss')}
                            </Col>
                        </Row> :
                        <h4>No Wiki Found</h4>
                }
            </Col>
            <ModalSearchWiki 
                modal={modalSearchOpen}
                setModal={setModalSearchOpen}
                wikis={wikis}
                handleSelectWiki={handleSelectWiki}
            />
        </Row>
    );
}