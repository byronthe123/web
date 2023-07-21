import React from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';
import { IQueue, IUser } from '../../../globals/interfaces';
import { formatMawb } from '../../../utils';
import { SelectedTypeOptions } from './interfaces';

const blueBg = require('../../../assets/img/bg-blue-sm.png');
const greenBg = require('../../../assets/img/bg-green-sm.png');
const purpleBg = require('../../../assets/img/bg-purple-sm.png');

interface Props {
    user: IUser;
    awb: IQueue;
    isMyAssignment: (awb: IQueue) => boolean;
    selectedType: SelectedTypeOptions;
    handleReject: (awb: IQueue) => void;
    handleSearchAwb: (e: any, overrideSearchAwb: string) => Promise<void>;
}

const CompanyCardDetails = ({
    user,
    awb,
    isMyAssignment,
    selectedType,
    handleReject,
    handleSearchAwb,
}: Props) => {
    if (selectedType === 'ALL' || selectedType === awb.s_type) {
        return (
            <Wrapper
                className={`card my-1 px-2 py-2`}
                bgImg={
                    awb.s_type === 'EXPORT'
                        ? `url(${blueBg})`
                        : awb.s_type === 'TRANSFER-IMPORT'
                        ? `url(${purpleBg})`
                        : `url(${greenBg})`
                }
            >
                <h4
                    className="my-0 py-0 text-dark"
                    style={{ fontWeight: 'bold' }}
                >
                    <div className="row">
                        <div className="col-9">
                            <div className="row mx-0">
                                <div className="col-6 pl-0">
                                    <h2
                                        className="mt-3 hyperlink"
                                        onClick={() =>
                                            handleSearchAwb(null, awb.s_mawb)
                                        }
                                    >
                                        {formatMawb(awb.s_mawb)}
                                    </h2>
                                </div>
                                <div className="col-6">
                                    <img
                                        src={awb.s_logo || ''}
                                        style={{
                                            width: '240px',
                                            height: 'auto',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-2 pt-3">
                            {user.i_access_level >= 3 && (
                                <Button
                                    color={'danger'}
                                    onClick={() => handleReject(awb)}
                                >
                                    Reject
                                </Button>
                            )}
                        </div>
                    </div>
                </h4>
            </Wrapper>
        );
    } else {
        return <div></div>;
    }
};

const Wrapper = styled.div<{ bgImg: string }>`
    border-radius: 0.75rem 0.75rem;
    background-image: ${(p) => p.bgImg};
    background-repeat: no-repeat;
    background-size: cover;
`;

export default CompanyCardDetails;
