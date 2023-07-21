import React, { useState, useEffect, useRef } from 'react';
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { Row, Col, Button } from 'reactstrap';
import CreateUpdateWikiModal from './ModalCreateUpdateWiki';
import CreateFileLinkModal from './ModalCreateFileLink';
import ModalLinkWiki from '../../components/dev/ModalLinkWiki';
import ModalAddTag from '../../components/dev/ModalAddTag';
import Axios from 'axios';
import ReactTable from '../../components/custom/ReactTable';
import moment from 'moment';
import { addLocalValue, updateLocalValue, api } from '../../utils';
import { useHistory } from 'react-router-dom';

export default ({
    baseApiUrl,
    headerAuthCode,
    asyncHandler,
    user,
    createSuccessNotification
}) => {

    const history = useHistory();

    const editorRef = useRef();

    // wiki data
    const [wikis, setWikis] = useState([]);
    const [accessLevels, setAccessLevels] = useState([]);

    useEffect(() => {
        const getWikis = async() => {

            const res = await api('get', `wiki/getWikis/${user.i_access_level}`);
    
            setWikis(res.data.wikis);
            setAccessLevels(res.data.accessLevels);
    
            if (history.location.search && history.location.search.length > 0) {
                const editId = history.location.search.split('=')[1];
                if (editId && !isNaN(parseInt(editId))) {
                    const wiki = res.data.wikis.find(w => w.id === parseInt(editId));
                    handleCreateUpdateWiki(false, wiki);
                }
            }
        };
        if (user && user.i_access_level) {
            getWikis();
        }
    }, [user && user.i_access_level]);

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

    const handleCreateUpdateWiki = (createNew, wiki={}) => {
        setCreateNew(createNew);
        setSelectedWiki(wiki);

        if (!createNew) {
            set_s_title(wiki.s_title);
            set_s_category(wiki.s_category);
            set_s_wiki(wiki.s_wiki);
            const { s_tags } = wiki;
            const tags = s_tags && s_tags.length > 0 ? s_tags.split('•').filter(t => t.length > 0) : [];
            setTags(tags);
            set_b_locked(wiki.b_locked);
            set_i_access_level(wiki.i_access_level);
        } else {
            set_s_title('');
            set_s_category('PORTAL');
            set_s_wiki('');
            setTags([]);
            set_b_locked(false);
            set_i_access_level(user.i_access_level);
        }

        setModalWiki(true);
    }

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
            setSelectedWiki(res.data);
            setCreateNew(false);
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

    return (
        <>  
            <Row className={'mb-2'}>
                <Col md={12}>
                    <h1 className={'d-inline mr-3'}>Wiki</h1>
                    <Button 
                        className={'d-inline mr-5'}
                        onClick={() => handleCreateUpdateWiki(true)}
                    >
                        Create New 
                    </Button>
                    <ReactTable 
                        data={wikis}
                        mapping={[
                            {
                                name: 'ID',
                                value: 'id'
                            },
                            {
                                name: 'Wiki Title',
                                value: 's_title'
                            },
                            {
                                name: 'Category',
                                value: 's_category'
                            },
                            {
                                name: 'Created by',
                                value: 's_created_by',
                                email: true
                            },
                            {
                                name: 'Created',
                                value: 't_created',
                                datetime: true,
                                utc: true
                            },
                            {
                                name: 'Modified by',
                                value: 's_modified_by',
                                email: true
                            },
                            {
                                name: 'Modified',
                                value: 't_modified',
                                datetime: true,
                                utc: true
                            }
                        ]}
                        enableClick={true}
                        handleClick={(item) => handleCreateUpdateWiki(false, item)}
                    />
                </Col>
            </Row>
            <CreateUpdateWikiModal 
                modal={modalWiki}
                setModal={setModalWiki}
                editorRef={editorRef}
                setModalCreateLink={setModalCreateLink}
                createdLink={createdLink}
                createNew={createNew}
                s_wiki={s_wiki}
                s_title={s_title}
                set_s_title={set_s_title}
                s_category={s_category}
                set_s_category={set_s_category}
                b_locked={b_locked}
                set_b_locked={set_b_locked}
                i_access_level={i_access_level}
                set_i_access_level={set_i_access_level}
                tags={tags}
                createUpdateWiki={createUpdateWiki}
                setModalLinkWiki={setModalLinkWiki}
                setModalAddTag={setModalAddTag}
                removeTag={removeTag}
                user={user}
                accessLevels={accessLevels}
            />
            <CreateFileLinkModal
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
        </>
    );
}