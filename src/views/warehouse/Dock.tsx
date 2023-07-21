import React from 'react';
import { withRouter } from 'react-router-dom';

import AppLayout from '../../components/AppLayout';
import useData from '../../components/warehouse/dock/useData';
import Companies from '../../components/warehouse/dock/Companies';
import Awbs from '../../components/warehouse/dock/Awbs';
import CompanyDetails from '../../components/warehouse/dock/CompanyDetails';
import ModalLocations from '../../components/warehouse/dock/ModalLocations';
import ModalSplit from '../../components/warehouse/dock/ModalSplit';
import ModalReject from '../../components/warehouse/dock/ModalReject';
import ModalChecklist from '../../components/warehouse/dock/ModalChecklist';
import '../../components/warehouse/dock/Dock.css';

const Dock = () => {
    const {
        user,
        step,
        setStep,
        companiesMap,
        selectedCompany,
        modalCompanyDetails,
        setModalCompanyDetails,
        handleSelectCompany,
        selectedAwb,
        setSelectedAwb,
        rackDataMap,
        prevNextAwb,
        availableDoors,
        activeUsers,
        selectedDoor,
        setSelectedDoor,
        selectedAgent,
        setSelectedAgent,
        assignDockDoor,
        removeDockDoorOrAgent,
        firstId,
        modalLocations,
        setModalLocations,
        modalSplit,
        setModalSplit,
        selectedLocation,
        setSelectedLocation,
        splitPieces,
        setSplitPieces,
        splitLocation,
        deliverRackPieces,
        modalReject,
        setModalReject,
        s_dock_reject_reason,
        set_s_dock_reject_reason,
        launchModalReject,
        rejectDockAwb,
        rejectType,
        modalChecklist,
        setModalChecklist,
        dockNextAwb,
        finishDocking,
    } = useData();

    return (
        <AppLayout>
            <div
                className={`card queue-card-container`}
                style={{
                    backgroundColor: '#f8f8f8',
                    overflowY: 'hidden',
                    overflowX: 'hidden',
                }}
                data-testId={'view-dock'}
            >
                <div className="card-body mb-5 px-1 py-1">
                    {step === 1 ? (
                        <Companies
                            companiesMap={companiesMap}
                            selectedCompany={selectedCompany}
                            handleSelectCompany={handleSelectCompany}
                            user={user}
                            firstId={firstId}
                        />
                    ) : step === 2 ? (
                        <Awbs
                            setStep={setStep}
                            selectedCompany={selectedCompany}
                            selectedAwb={selectedAwb}
                            setSelectedAwb={setSelectedAwb}
                            rackDataMap={rackDataMap}
                            handleSelectCompany={handleSelectCompany}
                            setModalLocations={setModalLocations}
                            launchModalReject={launchModalReject}
                            setModalChecklist={setModalChecklist}
                        />
                    ) : null}
                </div>
                <CompanyDetails
                    modal={modalCompanyDetails}
                    setModal={setModalCompanyDetails}
                    selectedCompany={selectedCompany}
                    rackDataMap={rackDataMap}
                    user={user}
                    availableDoors={availableDoors}
                    activeUsers={activeUsers}
                    selectedDoor={selectedDoor}
                    setSelectedDoor={setSelectedDoor}
                    selectedAgent={selectedAgent}
                    setSelectedAgent={setSelectedAgent}
                    assignDockDoor={assignDockDoor}
                    removeDockDoorOrAgent={removeDockDoorOrAgent}
                    setStep={setStep}
                    launchModalReject={launchModalReject}
                />
                <ModalLocations
                    modal={modalLocations}
                    toggle={() => setModalLocations(!modalLocations)}
                    selectedAwb={selectedAwb}
                    rackDataMap={rackDataMap}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    setModalSplit={setModalSplit}
                    deliverRackPieces={deliverRackPieces}
                    dockNextAwb={dockNextAwb}
                    prevNextAwb={prevNextAwb}
                />
                <ModalSplit
                    modal={modalSplit}
                    setModal={setModalSplit}
                    selectedLocation={selectedLocation}
                    splitPieces={splitPieces}
                    setSplitPieces={setSplitPieces}
                    splitLocation={splitLocation}
                />
                <ModalReject
                    modal={modalReject}
                    setModal={setModalReject}
                    rejectType={rejectType}
                    selectedAwb={selectedAwb}
                    selectedCompany={selectedCompany}
                    rejectDockAwb={rejectDockAwb}
                    s_dock_reject_reason={s_dock_reject_reason}
                    set_s_dock_reject_reason={set_s_dock_reject_reason}
                />
                <ModalChecklist
                    modal={modalChecklist}
                    setModal={setModalChecklist}
                    selectedCompany={selectedCompany}
                    rackDataMap={rackDataMap}
                    finishDocking={finishDocking}
                />
            </div>
        </AppLayout>
    );
};

export default withRouter(Dock);
