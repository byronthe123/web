import React from 'react';
import moment from 'moment';

export default function CreateBombReport ({
    values
}) {

    console.log(values.accent === true);

    const resolveChecked = (value) => value === true ? 'checked': '';

    return (
        <div dangerouslySetInnerHTML={{ __html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
                </head>
                <body>
                    <div class="modal-body">
                        <h1>Bomb Threat Checklist</h1>
                        <h6>Created by ${values.createdBy} at ${values.date}</h6>
                        <div class="row">
                        <div class="col-md-4">
                            <div class="form-group"><label class="">Time Caller Hung Up</label><input disabled name="hungUpTime" type="datetime-local" class="form-control" value="${values.hungUpTime}"></div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="">Phone Number where call received</label><input disabled name="callReceivedNum" type="text" class="form-control" value="${values.callReceivedNum}"></div>
                        </div>
                        </div>
                        <h4>Ask Caller</h4>
                        <div class="row">
                        <div class="col-md-4">
                            <div class="form-group"><label class="">Where is the bomb located?</label><input disabled name="bombLocation" type="text" class="form-control" value="${values.bombLocation}"></div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="">When will it go off?</label><input disabled name="bombDetonationdDate" type="datetime-local" class="form-control" value="${values.bombDetonationdDate}"></div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="">What does it look like?</label><input disabled name="bombDescription" type="text" class="form-control" value="${values.bombDescription}"></div>
                        </div>
                        </div>
                        <div class="row">
                        <div class="col-md-4">
                            <div class="form-group"><label class="">What kind of bomb is it?</label><input disabled name="bombType" type="text" class="form-control" value="${values.bombType}"></div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="">What will make it explode?</label><input disabled name="bombDetonationCause" type="text" class="form-control" value="${values.bombDetonationCause}"></div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="d-block">Did you place the bomb?</label><button type="button" class="btn btn-secondary">${values.placedBomb ? 'YES' : 'NO'}</button></div>
                        </div>
                        </div>
                        <div class="row">
                        <div class="col-md-4">
                            <div class="form-group"><label class="">Why did you place the bomb?</label><input disabled name="whyPlacedBomb" type="textarea" class="form-control" value="${values.whyPlacedBomb}"></div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="">What is your name?</label><input disabled name="perpName" type="text" class="form-control" value="${values.perpName}"></div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="">Exact Words of Threat</label><input disabled name="threat" type="textarea" class="form-control" value="${values.threat}"></div>
                        </div>
                        </div>
                        <div class="mx-2 row">
                        <div class="col-md-8">
                            <p class="font-weight-bold">Caller's Voice</p>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <input disabled name="accent" type="checkbox" label="Accent" id="accent" ${resolveChecked(values.accent)}>
                                        <label for="accent" class="ml-2">Accent</label>
                                    </div>
                    
                                    <div class="form-group"><input disabled name="angry" type="checkbox" label="Angry" id="angry" value="" ${resolveChecked(values.angry)}><label for="angry" class="ml-2">Angry</label></div>
                    
                                    <div class="form-group"><input disabled name="calm" type="checkbox" label="Calm" id="calm" ${resolveChecked(values.calm)}><label for="calm" class="ml-2">Calm</label></div>
                    
                                    <div class="form-group"><input disabled name="clearningThroat" type="checkbox" label="Clearning Throat" id="clearningThroat" ${resolveChecked(values.clearningThroat)}><label for="clearningThroat" class="ml-2">Clearning Throat</label></div>
                    
                                    <div class="form-group"><input disabled name="coughing" type="checkbox" label="Coughing" id="coughing" ${resolveChecked(values.coughing)}><label for="coughing" class="ml-2">Coughing</label></div>
                    
                                    <div class="form-group"><input disabled name="crackingVoice" type="checkbox" label="Cracking Voice" id="crackingVoice" ${resolveChecked(values.crackingVoice)}><label for="crackingVoice" class="ml-2">Cracking Voice</label></div>
                    
                                    <div class="form-group"><input disabled name="crying" type="checkbox" label="Crying" id="crying" ${resolveChecked(values.crying)}><label for="crying" class="ml-2">Crying</label></div>
                                    <div class="form-group"><input disabled name="deep" type="checkbox" label="Deep" id="deep" ${resolveChecked(values.deep)}><label for="deep" class="ml-2">Deep</label></div>
                                    <div class="form-group"><input disabled name="deepBreating" type="checkbox" label="Deep breating" id="deepBreating" ${resolveChecked(values.deepBreating)}><label for="deepBreating" class="ml-2">Deep breating</label></div>
                                    <div class="form-group"><input disabled name="disguised" type="checkbox" label="Disguised" id="disguised" ${resolveChecked(values.disguised)}><label for="disguised" class="ml-2">Disguised</label></div>
                                    <div class="form-group"><input disabled name="distinct" type="checkbox" label="Distinct" id="distinct" ${resolveChecked(values.distinct)}><label for="distinct" class="ml-2">Distinct</label></div>
                                    <div class="form-group"><input disabled name="excited" type="checkbox" label="Excited" id="excited" ${resolveChecked(values.excited)}><label for="excited" class="ml-2">Excited</label></div>
                                    <div class="form-group"><input disabled name="female" type="checkbox" label="Female" id="female" ${resolveChecked(values.female)}><label for="female" class="ml-2">Female</label></div>
                                    <div class="form-group"><input disabled name="laughter" type="checkbox" label="Laughter" id="laughter" ${resolveChecked(values.laughter)}><label for="laughter" class="ml-2">Laughter</label></div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group"><input disabled name="lisp" type="checkbox" label="Lisp" id="lisp" ${resolveChecked(values.lisp)}><label for="lisp" class="ml-2">Lisp</label></div>
                                    <div class="form-group"><input disabled name="loud" type="checkbox" label="Loud" id="loud" ${resolveChecked(values.loud)}><label for="loud" class="ml-2">Loud</label></div>
                                    <div class="form-group"><input disabled name="male" type="checkbox" label="Male" id="male" ${resolveChecked(values.male)}><label for="male" class="ml-2">Male</label></div>
                                    <div class="form-group"><input disabled name="nasal" type="checkbox" label="Nasal" id="nasal" ${resolveChecked(values.nasal)}><label for="nasal" class="ml-2">Nasal</label></div>
                                    <div class="form-group"><input disabled name="normal" type="checkbox" label="Normal" id="normal" ${resolveChecked(values.normal)}><label for="normal" class="ml-2">Normal</label></div>
                                    <div class="form-group"><input disabled name="ragged" type="checkbox" label="Ragged" id="ragged" ${resolveChecked(values.ragged)}><label for="ragged" class="ml-2">Ragged</label></div>
                                    <div class="form-group"><input disabled name="rapid" type="checkbox" label="Rapid" id="rapid" ${resolveChecked(values.rapid)}><label for="rapid" class="ml-2">Rapid</label></div>
                                    <div class="form-group"><input disabled name="raspy" type="checkbox" label="Raspy" id="raspy" ${resolveChecked(values.raspy)}><label for="raspy" class="ml-2">Raspy</label></div>
                                    <div class="form-group"><input disabled name="slow" type="checkbox" label="Slow" id="slow" ${resolveChecked(values.slow)}><label for="slow" class="ml-2">Slow</label></div>
                                    <div class="form-group"><input disabled name="slurred" type="checkbox" label="Slurred" id="slurred" ${resolveChecked(values.slurred)}><label for="slurred" class="ml-2">Slurred</label></div>
                                    <div class="form-group"><input disabled name="soft" type="checkbox" label="Soft" id="soft" ${resolveChecked(values.soft)}><label for="soft" class="ml-2">Soft</label></div>
                                    <div class="form-group"><input disabled name="stutter" type="checkbox" label="Stutter" id="stutter" ${resolveChecked(values.stutter)}><label for="stutter" class="ml-2">Stutter</label></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <p class="font-weight-bold">Background Sounds</p>
                            <div class="form-group"><input disabled name="animalNoises" type="checkbox" label="Animal noises" id="animalNoises" ${resolveChecked(values.animalNoises)}><label for="animalNoises" class="ml-2">Animal noises</label></div>
                            <div class="form-group"><input disabled name="houseNoises" type="checkbox" label="House noises" id="houseNoises" ${resolveChecked(values.houseNoises)}><label for="houseNoises" class="ml-2">House noises</label></div>
                            <div class="form-group"><input disabled name="kitchenNoises" type="checkbox" label="Kitchen noises" id="kitchenNoises" ${resolveChecked(values.kitchenNoises)}><label for="kitchenNoises" class="ml-2">Kitchen noises</label></div>
                            <div class="form-group"><input disabled name="streetNoises" type="checkbox" label="Street noises" id="streetNoises" ${resolveChecked(values.streetNoises)}><label for="streetNoises" class="ml-2">Street noises</label></div>
                            <div class="form-group"><input disabled name="booth" type="checkbox" label="Booth" id="booth" ${resolveChecked(values.booth)}><label for="booth" class="ml-2">Booth</label></div>
                            <div class="form-group"><input disabled name="pASystem" type="checkbox" label="PA System" id="pASystem" ${resolveChecked(values.pASystem)}><label for="pASystem" class="ml-2">PA System</label></div>
                            <div class="form-group"><input disabled name="conversation" type="checkbox" label="Conversation" id="conversation" ${resolveChecked(values.conversation)}><label for="conversation" class="ml-2">Conversation</label></div>
                            <div class="form-group"><input disabled name="music" type="checkbox" label="Music" id="music" ${resolveChecked(values.music)}><label for="music" class="ml-2">Music</label></div>
                            <div class="form-group"><input disabled name="motor" type="checkbox" label="Motor" id="motor" ${resolveChecked(values.motor)}><label for="motor" class="ml-2">Motor</label></div>
                            <div class="form-group"><input disabled name="clear" type="checkbox" label="Clear" id="clear" ${resolveChecked(values.clear)}><label for="clear" class="ml-2">Clear</label></div>
                            <div class="form-group"><input disabled name="static" type="checkbox" label="Static" id="static" ${resolveChecked(values.static)}><label for="static" class="ml-2">Static</label></div>
                            <div class="form-group"><input disabled name="officeMachinery" type="checkbox" label="Office machinery" ${resolveChecked(values.officeMachinery)} id="officeMachinery"><label for="officeMachinery" class="ml-2">Office machinery</label></div>
                            <div class="form-group"><input disabled name="factoryMachinery" type="checkbox" label="Factory machinery" ${resolveChecked(values.factoryMachinery)} id="factoryMachinery"><label for="factoryMachinery" class="ml-2">Factory machinery</label></div>
                            <div class="form-group"><input disabled name="local" type="checkbox" label="Local" id="local" ${resolveChecked(values.local)}><label for="local" class="ml-2">Local</label></div>
                            <div class="form-group"><input disabled name="longDistance" type="checkbox" label="Long distance" id="longDistance" ${resolveChecked(values.longDistance)}><label for="longDistance" class="ml-2">Long distance</label></div>
                        </div>
                        </div>
                        <div class="mx-2 row">
                        <div class="col-md-8">
                            <label class="">Threat Language</label>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <div class="form-group"><input disabled name="incoherent" type="checkbox" label="Incoherent" id="incoherent" ${resolveChecked(values.incoherent)}><label for="incoherent" class="ml-2">Incoherent</label></div>
                                        <div class="form-group"><input disabled name="messageRead" type="checkbox" label="Message Read" id="messageRead" ${resolveChecked(values.messageRead)}><label for="messageRead" class="ml-2">Message Read</label></div>
                                        <div class="form-group"><input disabled name="taped" type="checkbox" label="Taped" id="taped" ${resolveChecked(values.taped)}><label for="taped" class="ml-2">Taped</label></div>
                                        <div class="form-group"><input disabled name="irrational" type="checkbox" label="Irrational" ${resolveChecked(values.irrational)} id="irrational"><label for="irrational" class="ml-2">Irrational</label></div>
                                        <div class="form-group"><input disabled name="profane" type="checkbox" label="Profane" id="profane" ${resolveChecked(values.profane)}><label for="profane" class="ml-2">Profane</label></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <div class="form-group"><input disabled name="wellSpoken" type="checkbox" label="Well-spoken" ${resolveChecked(values.wellSpoken)} id="wellSpoken"><label for="well-spoken" class="ml-2">Well-spoken</label></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="">Other Information</label><input disabled name="other" type="textarea" class="form-control" value="${values.other}"></div>
                        </div>
                        </div>
                        <div class="row">
                        <div class="col-md-12">
                            <h4>Information about Caller</h4>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="">Where is the caller located?</label><input disabled name="callerLocation" type="text" class="form-control" value="${values.callerLocation}"></div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="">Estimated Age</label><input disabled name="callerAge" type="number" class="form-control" value="${values.callerAge}"></div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"><label class="">Is the voice familiar?</label><input disabled name="voice" type="text" class="form-control" value="${values.voice}"></div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group"><label class="">Other Points?</label><input disabled name="otherAboutCaller" type="textarea" class="form-control" value="${values.otherAboutCaller}"></div>
                        </div>
                        </div>
                    </div>
                </body>
            </html>
        ` }}>

        </div>
    )
}
