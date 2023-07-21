import { useState } from "react";
import styled from "styled-components";
import { Input } from "reactstrap";
import dayjs from "dayjs";

import { api, fileDownload } from '../../../utils';
import Card from "../../custom/Card";

export default function DataPull () {
    const [startDate, setStartDate] = useState(dayjs().subtract(30, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

    const statsReport = async (startDate: string, endDate: string) => {
        const res = await api('post', 'statsReport', { d_start_date: startDate, d_end_date: endDate });
        fileDownload(res.data, 'Stats Report.csv');
    }

    const searchPaymentsByRange = async (startDate: string, endDate: string) => {
        const res = await api('get', `/payment/range?startDate=${startDate}&endDate=${endDate}`);
        fileDownload(res.data, `Payments Report ${startDate} - ${endDate}.csv`);
    }

    const processes = [{
        name: 'Stats Report',
        fn: statsReport
    }, {
        name: 'Payments Report',
        fn: searchPaymentsByRange
    }];


    return (
        <Container>
            <CustomCard>
                <DatesContainer>
                    <Input type={'date'} value={startDate} onChange={(e: any) => setStartDate(e.target.value)} />
                    to 
                    <Input type={'date'} value={endDate} onChange={(e: any) => setEndDate(e.target.value)}  />
                </DatesContainer>
                {
                    processes.map(process => (
                        <DownloadBtn onClick={() => process.fn(startDate, endDate)}>
                            {process.name}
                        </DownloadBtn>
                    ))
                }
            </CustomCard>
        </Container>
    );
}

const Container = styled.div`
`;

const CustomCard = styled(Card)`
    width: 400px;
`;

const DatesContainer = styled.div`
    display: flex;
    align-items: baseline;
    gap: 10px;
`;

const DownloadBtn = styled.div`
    background-color:#3ab763;
    color: white;
    font-size: 32px;
    height: 100px;
    border-radius: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 10px;

    &:hover {
        cursor: pointer;
        background-color:#35a95c;
    }
`;