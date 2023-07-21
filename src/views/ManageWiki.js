import React, { Component, Fragment, useState, useEffect, useContext, useRef  } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { AppContext } from '../context/index';
import moment from 'moment';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import SunEditor, { buttonList } from 'suneditor-react';
import Clipboard from 'react-clipboard.js';
import { asyncHandler } from '../utils';

import {Button, Row, Col, Input, Label} from 'reactstrap';
import AppLayout from '../components/AppLayout';
import Axios from 'axios';
import ModalCreateFileLink from '../components/dev/ModalCreateFileLink';
import ModalLinkWiki from '../components/dev/ModalLinkWiki';
import ModalAddTag from '../components/dev/ModalAddTag';
import { updateLocalValue, addLocalValue, api } from '../utils';

const ManageWiki = ({
    user, authButtonMethod, baseApiUrl, headerAuthCode, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, createSuccessNotification, eightyWindow, width
}) => {

    const { wiki } = useContext(AppContext);
    const {
        wikis,
        setWikis,
        accessLevels
    } = wiki;

    const categories = ['PORTAL', 'TRAINING', 'OPERATIONS', 'LEADS', 'MANAGERES', 'CORPORATE', 'HR'];

    const history = useHistory();

    const editorRef = useRef();

    // Create/Update Wiki Fields
    const [s_title, set_s_title] = useState('');
    const [s_category, set_s_category] = useState('');
    const [s_wiki, set_s_wiki] = useState('');
    const [tags, setTags] = useState([]);
    const [b_locked, set_b_locked] = useState(false);
    const [i_access_level, set_i_access_level] = useState('');
    const [createNew, setCreateNew] = useState(false);
    const [modalWiki, setModalWiki] = useState(false);
    const [selectedWiki, setSelectedWiki] = useState({});
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (user) {
            if (history.location.search && history.location.search.length > 0) {
                const editId = history.location.search.split('=')[1];
                if (editId && !isNaN(parseInt(editId))) {
                    const editWiki = wikis.find(w => w.id === parseInt(editId));
                    if (editWiki) {
                        setSelectedWiki(editWiki);
                        setCreateNew(false);
                        set_s_title(editWiki.s_title);
                        set_s_category(editWiki.s_category);
                        set_s_wiki(editWiki.s_wiki);
                        const { s_tags } = editWiki;
                        const tags = s_tags && s_tags.length > 0 ? s_tags.split('•').filter(t => t.length > 0) : [];
                        setTags(tags);
                        set_b_locked(editWiki.b_locked);
                        set_i_access_level(editWiki.i_access_level);    
                        setKey(key + 1);
                    } else {
                        history.push('/EOS/Portal/Wiki');
                    }
                }
            } else {
                setCreateNew(true);
                set_s_title('');
                set_s_category('PORTAL');
                set_s_wiki('');
                setTags([]);
                set_b_locked(false);
                set_i_access_level(user.i_access_level);
            }
        }
    }, [history.location.search, user]);

    const createUpdateWiki = asyncHandler(async() => {
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');

        let endpoint;
        const data = {
            s_title,
            s_category,
            s_wiki: editorRef.current.editor.getContents(),
            s_tags: tags.toString().replace(/,/g, '•'),
            b_locked,
            i_access_level,
            s_modified_by: user.s_email,
            t_modified: now,
        }

        if (createNew) {
            data.s_created_by = user.s_email;
            data.t_created = now;
            endpoint = 'createWiki';
        } else {
            data.id = selectedWiki.id;
            endpoint = 'updateWiki'
        }

        const res = await api('post', `wiki/${endpoint}`, { data });

        if (createNew) {
            addLocalValue(wikis, setWikis, res.data);
        } else {
            updateLocalValue(wikis, setWikis, selectedWiki.id, res.data);
        }

        createSuccessNotification('Saved');

    });

    // Create Image Link:
    const [modalCreateLink, setModalCreateLink] = useState(false);
    const [image, setImage] = useState({});
    const [imageKey, setImageKey] = useState(0);
    const [createdLink, setCreatedLink] = useState('');

    const createImageLink = asyncHandler(async() => {
        const res = await Axios.post(`${baseApiUrl}/wiki/createImageLink`, {
            data: {
                image
            }
        }, {
            headers: {
                Authorization: `Bearer ${headerAuthCode}`
            }
        });

        setCreatedLink(res.data.s_file_link);
    });

    // Link Wiki:
    const [modalLinkWiki, setModalLinkWiki] = useState(false);

    // Tags:
    const [modalAddTag, setModalAddTag] = useState(false);
    const [tag, setTag] = useState('');

    const addTag = () => {
        tags.push(tag);
        setTag('');
        setModalAddTag(false);
    }

    const removeTag = (tag) => {
        const updated = tags.filter(t => t !== tag);
        setTags(updated);
    }

    const enableSave = () => {
        return s_title && s_title.length > 0 && s_category.length > 0 && editorRef.current && editorRef.current.editor.getContents().length > 0;
    }

    return (
        <AppLayout user={user} authButtonMethod={authButtonMethod} baseApiUrl={baseApiUrl} headerAuthCode={headerAuthCode} launchModalChangeLocation={launchModalChangeLocation} handleDisplaySubmenu={handleDisplaySubmenu}>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md={12}>
                            <Row>
                                <Col md={2}>
                                    <h1>{createNew ? 'Create' : 'Update'} Wiki</h1>
                                </Col>
                                <Col md={6}>
                                    <h6 className={'d-inline mr-2'}>Title</h6>
                                    <Input type='text' className={'d-inline'} value={s_title} onChange={(e) => set_s_title(e.target.value)} />
                                </Col>
                                <Col md={4}>
                                    <h6 className={'d-inline mr-2'}>Category</h6>
                                    <Input type='select' className={'d-inline'} value={s_category} onChange={(e) => set_s_category(e.target.value)}>
                                        {
                                            categories.map(c => (
                                                <option value={c}>{c}</option>
                                            ))
                                        }
                                    </Input>
                                </Col>
                            </Row>
                            <Row className={'mt-2'}>
                                {
                                    user.i_access_level === 8 && 
                                        <Col md={1}>
                                            <Label className={'mr-2'}>Locked</Label>
                                            <Switch 
                                                className={'switch-dg'}
                                                checked={b_locked || false}
                                                onClick={() => set_b_locked(!b_locked)} 
                                            />
                                        </Col>
                                }
                                <Col md={11}>
                                    <Label>Maximum Access Level:</Label>
                                    <Row>
                                        {
                                            accessLevels && accessLevels.map((l, i) => (
                                                <Button 
                                                    key={i} 
                                                    className={'d-inline mr-1'} 
                                                    color={'primary'}
                                                    onClick={() => set_i_access_level(l.i_access_level)}
                                                    active={i_access_level === l.i_access_level}
                                                >
                                                    {l.i_access_level}. {l.s_name}
                                                </Button>
                                            )) 
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Row className={'my-2'}>
                                <Col md={12}>
                                    <Button 
                                        className={'d-inline mr-5'}
                                        onClick={() => setModalCreateLink(true)}
                                    >
                                        Create Image Link
                                    </Button>
                                    <Button 
                                        className={'d-inline'}
                                        onClick={() => setModalLinkWiki(true)}
                                    >
                                        Link to Another Wiki
                                    </Button>
                                    {
                                        createdLink.length > 0 && 
                                        <Row>
                                            <Col md={12}>
                                                <Label className={'d-inline mr-1'}>Last link:</Label>
                                                <Label id={'copyLink2'} className={'d-inline mr-1'}>
                                                    {createdLink}
                                                </Label>
                                                <Clipboard data-clipboard-target="#copyLink2" className={'d-inline btn btn-secondary'}>
                                                    <i className={'fas fa-copy'} style={{ fontSize: '20px' }} />
                                                </Clipboard>
                                            </Col>
                                        </Row>
                                    }
                                </Col>
                            </Row>
                            <SunEditor 
                                enable={true} 
                                ref={editorRef}
                                defaultValue={s_wiki}
                                setOptions={{
                                    buttonList: buttonList.complex
                                }}
                                height={500}
                                key={key}
                            />
                            <Row style={{width: '100%'}} className={'mt-2'}>
                                <Col md={11}>
                                    <Label className={'d-inline mr-2'}>Tags:</Label>
                                    {
                                        tags && tags.length > 0 && tags.map((t, i) => (
                                            <button 
                                                className={'default btn btn-info d-inline mr-2'} 
                                                key={i}
                                            >
                                                {t}
                                                <i 
                                                    className={'fal fa-times-circle ml-2'} 
                                                    style={{ fontSize: '18px' }} 
                                                    onClick={() => removeTag(t)}
                                                />
                                            </button>
                                        ))
                                    }
                                    <Button onClick={() => setModalAddTag(true)}>New</Button>
                                </Col>
                                <Col md={1}>
                                    <Button 
                                        color="primary" 
                                        onClick={() => createUpdateWiki()}
                                        disabled={!enableSave()}
                                    >
                                        Save
                                    </Button>                
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalCreateFileLink
                modal={modalCreateLink}
                setModal={setModalCreateLink}
                setImage={setImage}
                imageKey={imageKey}
                createImageLink={createImageLink}
                createdLink={createdLink}
                setModalLinkWiki={setModalLinkWiki}
            />
            <ModalLinkWiki 
                modal={modalLinkWiki}
                setModal={setModalLinkWiki}
                wikis={wikis}
            />
            <ModalAddTag 
                modal={modalAddTag}
                setModal={setModalAddTag}
                tag={tag}
                setTag={setTag}
                addTag={addTag}
            />
        </AppLayout>
    );
}

export default withRouter(ManageWiki);